---
name: ssr
description: Semantic Similarity Rating - elicit realistic Likert-scale responses from LLMs using textual elicitation and embedding similarity mapping. Use when you need survey-like responses, purchase intent ratings, relevance scores, or any Likert-scale measurement that should match human response distributions.
---

# Semantic Similarity Rating (SSR)

SSR is a method for eliciting realistic Likert-scale responses from LLMs. Instead of asking for direct numerical ratings (which produce unrealistic, narrow distributions), SSR:

1. Elicits free-text responses about the subject
2. Maps those responses to Likert scale distributions using embedding similarity

This achieves ~90% of human test-retest reliability while maintaining realistic response distributions (KS similarity > 0.85).

## When to Use SSR

- Consumer research / purchase intent surveys
- Product concept evaluation
- Relevance or satisfaction ratings
- Any Likert-scale measurement where you need realistic distributions
- When you need qualitative feedback alongside quantitative scores

## The Problem with Direct Likert Rating

When LLMs are asked directly for Likert ratings (1-5), they:
- Regress to "safe" middle values (mostly 3s)
- Produce unrealistically narrow distributions
- Rarely use extreme values (1 or 5)
- Lose the nuance of their actual assessment

## SSR Method

### Step 1: Create Synthetic Consumer Persona

Prompt the LLM to impersonate a consumer with specific demographic attributes:

```
You are participating in a consumer research survey. You are a [age]-year-old [gender] living in [region] with [income level description].

You will be shown a product concept and asked about your purchase intent. Respond naturally and briefly as this person would.
```

**Key demographics to include:**
- Age (influences purchase intent significantly)
- Gender
- Income level (strongly influences purchase intent)
- Region/location
- Ethnicity (optional, less consistent influence)

### Step 2: Present Stimulus and Elicit Free-Text Response

Show the product concept (image or text) and ask:

```
How likely would you be to purchase this product?

Reply briefly to any questions posed to you.
```

**Do NOT constrain the response to a number.** Let the LLM respond naturally, e.g.:
- "I'm somewhat interested. If it works well and isn't too expensive, I might give it a try."
- "Seems kinda bougie for this kind of product. I'll stick with what I know."
- "The ease of use and safety are appealing, but I'd want to know more about effectiveness."

### Step 3: Map Response to Likert Distribution via Embedding Similarity

#### Reference Statement Sets

Create anchor statements for each Likert value. Use multiple sets (recommended: 6) and average results:

**Set 1 - Direct likelihood:**
```
1: "It's very unlikely I'd buy it."
2: "It's rather unlikely I'd buy it."
3: "I'm not sure if I'd buy it."
4: "It's rather likely I'd buy it."
5: "It's very likely I'd buy it."
```

**Set 2 - Intent phrasing:**
```
1: "I definitely would not purchase this."
2: "I probably would not purchase this."
3: "I might or might not purchase this."
4: "I probably would purchase this."
5: "I definitely would purchase this."
```

**Set 3 - Interest-based:**
```
1: "I have no interest in buying this."
2: "I have little interest in buying this."
3: "I have some interest in buying this."
4: "I have considerable interest in buying this."
5: "I have strong interest in buying this."
```

**Set 4 - Casual phrasing:**
```
1: "No way I'd buy this."
2: "Probably wouldn't buy this."
3: "Maybe I'd buy this, maybe not."
4: "Yeah, I'd probably buy this."
5: "For sure I'd buy this."
```

**Set 5 - Conditional phrasing:**
```
1: "I wouldn't buy this under any circumstances."
2: "I'd need a lot of convincing to buy this."
3: "I could see myself buying this in the right situation."
4: "I'd likely buy this if I saw it in stores."
5: "I'd definitely buy this as soon as it's available."
```

**Set 6 - Recommendation framing:**
```
1: "I would actively avoid this product."
2: "I wouldn't recommend this product."
3: "This product seems okay."
4: "I would consider recommending this product."
5: "I would enthusiastically recommend this product."
```

#### Compute Similarity Scores

1. Get embedding vectors for:
   - The synthetic response: `v_response`
   - Each reference statement: `v_ref[1..5]`

2. Compute cosine similarity for each reference:
   ```
   similarity[r] = (v_response · v_ref[r]) / (|v_response| × |v_ref[r]|)
   ```

3. Convert to probability distribution:
   ```
   # Subtract minimum to create contrast
   min_sim = min(similarity[1..5])
   adjusted[r] = similarity[r] - min_sim

   # Normalize to probability distribution
   p[r] = adjusted[r] / sum(adjusted[1..5])
   ```

4. Average across all reference sets for final distribution

#### Embedding Model

Use OpenAI's `text-embedding-3-small` (or `text-embedding-3-large` for marginal improvement).

### Step 4: Aggregate Results

For a synthetic survey panel:
- Generate multiple synthetic consumers with varied demographics
- Collect response distributions from each
- Aggregate into survey-level distributions
- Calculate mean purchase intent: `PI = sum(r × p[r])` for r in 1..5

## Implementation Notes

### Temperature Settings

- LLM temperature: 0.5 works well (0.5-1.5 range tested)
- Generate 2 samples per consumer and average for stability

### Demographics Matter

Without demographics, LLMs:
- Achieve high distributional similarity (~0.91 KS)
- But poor correlation attainment (~50%)
- They rate everything positively without discriminating

With demographics:
- Better correlation attainment (~90%)
- LLMs properly differentiate between product concepts
- Age and income have strongest influence on response patterns

### Image vs Text Stimulus

- Image stimulus (product concept slides) performs slightly better
- Text-only descriptions work but with mild performance reduction
- For text stimulus, transcribe key information from product concepts

## Success Metrics

### Distributional Similarity (KS Similarity)

```
KS_similarity = 1 - max|F_real(r) - F_synthetic(r)|
```

Target: > 0.85

### Correlation Attainment

Compare synthetic-real correlation to human test-retest reliability:

```
ρ = E[R_xy] / E[R_xx]
```

Where:
- R_xy = correlation between synthetic and real mean purchase intents
- R_xx = correlation between split-half human samples (theoretical maximum)

Target: > 90%

## Alternative: Follow-up Likert Rating (FLR)

A simpler alternative that performs reasonably well:

1. Elicit free-text response (same as SSR)
2. Prompt a second LLM instance as a "Likert rating expert"
3. Have it map the text response to a single integer 1-5

FLR achieves:
- ~85% correlation attainment
- ~0.72 KS similarity (worse than SSR's 0.88)

Use SSR when distribution realism matters; FLR when you only need ranking.

## Qualitative Benefits

SSR's textual responses provide rich qualitative feedback:

**Positive feedback example:**
"The ease of use and the promise of no sensitivity are appealing. Plus, it's from a trusted brand."

**Critical feedback example:**
"It seems a bit too high-end for my needs and budget."
"Sounds expensive, and I'm not sure I buy all that 'microbiome' talk."

This qualitative data can inform product development beyond just ratings.

## Limitations

1. **Reference set sensitivity**: Different anchor sets produce slightly different mappings. Average across multiple sets.

2. **Domain dependency**: Works best for domains well-represented in LLM training data (consumer products, general topics). May hallucinate for obscure domains.

3. **Demographic fidelity**: Age and income patterns replicate well. Gender and region patterns are less consistent.

4. **Not a replacement**: SSR augments human research; it shouldn't fully replace human panels for final decisions.

## Quick Reference

| Method | Correlation Attainment | KS Similarity |
|--------|----------------------|---------------|
| Direct Likert Rating | ~80% | 0.26-0.39 |
| Follow-up Likert Rating | ~85% | 0.59-0.72 |
| **SSR** | **~90%** | **0.80-0.88** |
| Human test-retest | 100% (by definition) | 1.0 |

## Example Workflow

```python
# Pseudocode for SSR implementation

def ssr_rating(product_concept, demographics):
    # Step 1: Create persona prompt
    persona = create_persona_prompt(demographics)

    # Step 2: Elicit free-text response
    response = llm.generate(
        system=persona,
        user=f"[Product concept: {product_concept}]\n\nHow likely would you be to purchase this product?",
        temperature=0.5
    )

    # Step 3: Get embeddings
    response_embedding = embed(response)

    # Step 4: Compute distribution across all reference sets
    distributions = []
    for ref_set in REFERENCE_SETS:
        ref_embeddings = [embed(stmt) for stmt in ref_set]
        similarities = [cosine_similarity(response_embedding, ref_emb)
                       for ref_emb in ref_embeddings]

        # Normalize to distribution
        min_sim = min(similarities)
        adjusted = [s - min_sim for s in similarities]
        total = sum(adjusted)
        distribution = [a / total for a in adjusted]
        distributions.append(distribution)

    # Average across reference sets
    final_distribution = average(distributions)

    return {
        'distribution': final_distribution,
        'mean_pi': sum((r+1) * p for r, p in enumerate(final_distribution)),
        'qualitative_response': response
    }
```

## References

Maier, B.F., et al. (2025). "LLMs Reproduce Human Purchase Intent via Semantic Similarity Elicitation of Likert Ratings." arXiv:2510.08338v2

GitHub implementation: https://github.com/pymc-labs/semantic-similarity-rating
