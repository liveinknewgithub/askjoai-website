const PROPERTY_SETS = {
    brown: {
        name: 'Brown',
        target: 2,
        targetValue: 1,
        color: '🤎',
    },
    lightblue: {
        name: 'Light Blue',
        target: 3,
        targetValue: 2,
        color: '💠',
    },
    pink: {
        name: 'Pink',
        target: 3,
        targetValue: 3,
        color: '💗',
    },
    orange: {
        name: 'Orange',
        target: 3,
        targetValue: 4,
        color: '🟧',
    },
    red: {
        name: 'Red',
        target: 3,
        targetValue: 5,
        color: '❤️',
    },
    yellow: {
        name: 'Yellow',
        target: 3,
        targetValue: 4,
        color: '💛',
    },
    green: {
        name: 'Green',
        target: 3,
        targetValue: 6,
        color: '💚',
    },
    blue: {
        name: 'Blue',
        target: 2,
        targetValue: 5,
        color: '💙',
    },
    railroad: {
        name: 'Railroads',
        target: 2,
        targetValue: 3,
        color: '🚂',
    },
    utility: {
        name: 'Utilities',
        target: 2,
        targetValue: 3,
        color: '⚡',
    },
};

const MONEY_CARDS = [
    { id: 'money-1', name: 'Money $1', value: 1, max: 10 },
    { id: 'money-2', name: 'Money $2', value: 2, max: 10 },
    { id: 'money-3', name: 'Money $3', value: 3, max: 10 },
    { id: 'money-4', name: 'Money $4', value: 4, max: 10 },
    { id: 'money-5', name: 'Money $5', value: 5, max: 10 },
    { id: 'money-10', name: 'Money $10', value: 10, max: 10 },
];

const PROPERTY_CARDS = [
    { id: 'prop-brown', name: 'Brown Property', setKey: 'brown', max: 2 },
    { id: 'prop-lightblue', name: 'Light Blue Property', setKey: 'lightblue', max: 3 },
    { id: 'prop-pink', name: 'Pink Property', setKey: 'pink', max: 3 },
    { id: 'prop-orange', name: 'Orange Property', setKey: 'orange', max: 3 },
    { id: 'prop-red', name: 'Red Property', setKey: 'red', max: 3 },
    { id: 'prop-yellow', name: 'Yellow Property', setKey: 'yellow', max: 3 },
    { id: 'prop-green', name: 'Green Property', setKey: 'green', max: 3 },
    { id: 'prop-blue', name: 'Blue Property', setKey: 'blue', max: 2 },
    { id: 'prop-railroad', name: 'Railroad Property', setKey: 'railroad', max: 2 },
    { id: 'prop-utility', name: 'Utility Property', setKey: 'utility', max: 2 },
];

const WILD_CARDS = [
    {
        id: 'wild-black',
        name: 'Wild (Any color)',
        max: 2,
    },
];

const ACTION_CARDS = [
    { id: 'action-deal-breaker', name: 'Deal Breaker', max: 1 },
    { id: 'action-sly-deal', name: 'Sly Deal', max: 2 },
    { id: 'action-forced-deal', name: 'Forced Deal', max: 2 },
    { id: 'action-debt-collector', name: 'Debt Collector', max: 2 },
    { id: 'action-birthday', name: "It's My Birthday", max: 2 },
    { id: 'action-rent', name: 'Rent', max: 2 },
    { id: 'action-double-rent', name: 'Double the Rent', max: 1 },
    { id: 'action-house', name: 'House', max: 2 },
    { id: 'action-hotel', name: 'Hotel', max: 2 },
    { id: 'action-pass-go', name: 'Pass Go', max: 2 },
    { id: 'action-just-say-no', name: 'Just Say No', max: 3 },
];

const cardDefinitions = [
    ...MONEY_CARDS.map((card) => ({ ...card, category: 'money' })),
    ...PROPERTY_CARDS.map((card) => ({ ...card, category: 'property' })),
    ...WILD_CARDS.map((card) => ({ ...card, category: 'wild' })),
    ...ACTION_CARDS.map((card) => ({ ...card, category: 'action' })),
];

const HAND_CATEGORIES = [
    { title: 'Money cards', key: 'money' },
    { title: 'Property cards', key: 'property' },
    { title: 'Wild cards', key: 'wild' },
    { title: 'Action cards', key: 'action' },
];

function renderSetGrid() {
    const setGrid = document.getElementById('set-grid');

    const entries = Object.entries(PROPERTY_SETS);
    const content = entries
        .map(([setKey, setInfo]) => {
            const { name, color } = setInfo;
            return `
                <article class="set-card">
                    <small>${color} ${name} (target: ${setInfo.target} cards)</small>
                    <label>
                        Cards in set
                        <input
                            id="set-${setKey}"
                            type="number"
                            min="0"
                            max="5"
                            value="0"
                        />
                    </label>
                </article>
            `;
        })
        .join('');

    setGrid.innerHTML = content;
}

function renderHandGrid() {
    const handGrid = document.getElementById('hand-grid');
    handGrid.innerHTML = HAND_CATEGORIES.map(({ title, key }) => {
        const cards = cardDefinitions.filter((card) => card.category === key);
        const rows = cards
            .map(
                (card) => `
                    <div class="card-row">
                        <span class="card-name">${card.name}</span>
                        <label>
                            Qty
                            <input
                                id="${card.id}"
                                type="number"
                                min="0"
                                max="${card.max}"
                                value="0"
                            />
                        </label>
                    </div>
                `,
            )
            .join('');

        return `
            <section class="card-group">
                <h3>${title}</h3>
                ${rows}
            </section>
        `;
    }).join('');
}

function parseNumber(value, fallback = 0) {
    const parsed = Number(value);
    if (Number.isNaN(parsed)) return fallback;
    return Math.max(0, parsed);
}

function readGameState() {
    const opponents = parseNumber(document.getElementById('opponents').value, 0);
    const opponentMoney = parseNumber(document.getElementById('opponent-money').value, 0);
    const opponentSets = parseNumber(document.getElementById('opponent-sets').value, 0);
    const yourBank = parseNumber(document.getElementById('your-bank').value, 0);

    const ownSets = {};
    Object.keys(PROPERTY_SETS).forEach((setKey) => {
        const value = parseNumber(document.getElementById(`set-${setKey}`).value, 0);
        ownSets[setKey] = value;
    });

    const hand = {};
    cardDefinitions.forEach((card) => {
        const el = document.getElementById(card.id);
        hand[card.id] = Math.max(0, parseInt(el?.value || '0', 10));
    });

    return {
        opponents,
        opponentMoney,
        opponentSets,
        yourBank,
        ownSets,
        hand,
    };
}

function getMoneyPicks(state, reservedCounts, limit) {
    const money = MONEY_CARDS.map((card) => ({
        ...card,
        count: Math.max(0, (state.hand[card.id] || 0) - (reservedCounts[card.id] || 0)),
    })).sort((a, b) => b.value - a.value);

    const picks = [];
    let slots = limit;

    for (const card of money) {
        if (slots <= 0) break;
        for (let i = 0; i < Math.min(card.count, slots); i += 1) {
            picks.push({ ...card, qty: 1 });
            slots -= 1;
        }
    }

    return picks;
}

function addMove(moves, move) {
    const existing = moves.find((entry) => entry.title === move.title);
    if (existing) {
        existing.score = Math.max(existing.score, move.score);
        return;
    }

    moves.push(move);
}

function buildPrimaryMove(cardName, qty, backups, extras = []) {
    const list = [];
    if (qty > 0) {
        list.push({ name: cardName, qty: qty, type: 'primary' });
    }

    list.push(...extras);

    if (backups.length > 0) {
        for (const backup of backups) {
            list.push({ ...backup, type: 'backup' });
        }
    }

    return list;
}

function scorePropertyMoves(state, ownSets, hand, moves) {
    PROPERTY_CARDS.forEach((card) => {
        const count = hand[card.id] || 0;
        if (!count) return;

        const setInfo = PROPERTY_SETS[card.setKey];
        const current = ownSets[card.setKey] || 0;

        for (let copy = 0; copy < count; copy += 1) {
            const isMissing = Math.max(0, setInfo.target - current);
            if (isMissing <= 0) {
                break;
            }

            const reserved = { [card.id]: 1 + copy };
            const backups = getMoneyPicks(state, reserved, 2);

            let score = 58;
            if (isMissing === 1) score += 65;
            else score += 35;
            if (setInfo.target === 2) score += 10;
            score += setInfo.targetValue;

            let reason = `Completing a ${setInfo.name} set is one of the fastest paths to 3 sets.`;
            if (isMissing === 1) {
                reason = `You are one card away from completing ${setInfo.name}.`;
            } else if (isMissing > 1) {
                reason = `Build a solid ${setInfo.name} foundation before your opponents can attack.`;
            }

            if (state.opponentSets >= 2 && setInfo.target === 3) {
                score += 8;
                reason += ' High-value 3-card sets are also pressure points.';
            }

            const moveText = buildPrimaryMove(card.name, 1, backups);

            addMove(moves, {
                title: `Play ${card.name}`,
                score,
                steps: moveText,
                reason,
            });
        }
    });
}

function scoreWildMoves(state, ownSets, hand, moves) {
    const wildCount = hand['wild-black'] || 0;
    if (!wildCount) return;

    for (let copy = 0; copy < wildCount; copy += 1) {
        let best = null;

        Object.entries(PROPERTY_SETS).forEach(([setKey, setInfo]) => {
            const current = ownSets[setKey] || 0;
            if (current >= setInfo.target) return;

            const missing = setInfo.target - current;
            const score = (missing === 1 ? 70 : 48) + setInfo.targetValue;
            const reason = `Use this wild card to push ${setInfo.name} closer to completion.`;

            if (!best || score > best.score) {
                best = {
                    setKey,
                    setInfo,
                    score,
                    reason,
                };
            }
        });

        if (best) {
            const reserved = { 'wild-black': 1 + copy };
            const backups = getMoneyPicks(state, reserved, 2);

            addMove(moves, {
                title: `Use Wild property on ${best.setInfo.name}`,
                score: best.score + 15,
                steps: buildPrimaryMove('Wild Property', 1, backups),
                reason: best.reason,
            });
        }
    }
}

function scoreActionMoves(state, ownSets, hand, moves) {
    const completedSets = Object.entries(ownSets).reduce((acc, [setKey, count]) => {
        const target = PROPERTY_SETS[setKey].target;
        return acc + (count >= target ? 1 : 0);
    }, 0);

    if (hand['action-deal-breaker'] > 0 && state.opponentSets > 0) {
        const backups = getMoneyPicks(state, { 'action-deal-breaker': 1 }, 2);
        addMove(moves, {
            title: 'Play Deal Breaker',
            score: 220,
            steps: buildPrimaryMove('Deal Breaker', 1, backups),
            reason:
                'If available, this is usually the strongest single-turn play when opponents have sets. You can steal an entire completed set instantly.',
        });
    }

    if (hand['action-sly-deal'] > 0 && state.opponentSets > 0) {
        const backups = getMoneyPicks(state, { 'action-sly-deal': 1 }, 2);
        addMove(moves, {
            title: 'Play Sly Deal',
            score: 150 + Math.min(25, state.opponentSets * 8),
            steps: buildPrimaryMove('Sly Deal', 1, backups),
            reason:
                'Sly Deal is a flexible steal card and less predictable than Deal Breaker. Use it when the opponent has valuable property exposed.',
        });
    }

    if (hand['action-forced-deal'] > 0 && state.opponentSets > 0) {
        const backups = getMoneyPicks(state, { 'action-forced-deal': 1 }, 2);
        addMove(moves, {
            title: 'Play Forced Deal',
            score: 132 + Math.min(20, state.opponentSets * 7),
            steps: buildPrimaryMove('Forced Deal', 1, backups),
            reason:
                'Good for trading off property that slows your opponent’s set-up and improves your board pressure.',
        });
    }

    if (hand['action-debt-collector'] > 0 && state.opponentMoney >= 5) {
        const backups = getMoneyPicks(state, { 'action-debt-collector': 1 }, 2);
        addMove(moves, {
            title: 'Play Debt Collector',
            score: 95 + Math.min(state.opponentMoney * 2, 40),
            steps: buildPrimaryMove('Debt Collector', 1, backups),
            reason:
                'This taxes your opponent if they are sitting on cash and can slow their next turn significantly.',
        });
    }

    if (hand['action-birthday'] > 0 && state.opponentMoney >= 1) {
        const backups = getMoneyPicks(state, { 'action-birthday': 1 }, 2);
        addMove(moves, {
            title: `Play It's My Birthday`,
            score: 90 + Math.min(state.opponents * 7, 30),
            steps: buildPrimaryMove("It's My Birthday", 1, backups),
            reason:
                'A quick money gain that scales with opponents. Great when they have liquid money and you need tempo.',
        });
    }

    if (hand['action-rent'] > 0 && completedSets > 0 && state.opponentMoney > 0) {
        const backups = getMoneyPicks(state, { 'action-rent': 1 }, 2);
        addMove(moves, {
            title: 'Play Rent',
            score: 102 + state.opponentMoney + completedSets * 8,
            steps: buildPrimaryMove('Rent', 1, backups),
            reason:
                'If you already have a complete set on board, rent often forces payment before your next property rush.',
        });
    }

    if (
        hand['action-double-rent'] > 0 &&
        hand['action-rent'] > 0 &&
        completedSets > 0 &&
        state.opponentMoney > 0
    ) {
        const backups = getMoneyPicks(state, { 'action-double-rent': 1, 'action-rent': 1 }, 1);
        addMove(moves, {
            title: 'Use Double Rent + Rent',
            score: 125 + state.opponentMoney + completedSets * 10,
            steps: [
                ...buildPrimaryMove('Double the Rent', 1, []),
                ...buildPrimaryMove('Rent', 1, []),
                ...backups,
            ],
            reason:
                'When you can combine these, rent swings harder and can lock down an opponent’s turn by forcing them to pay.',
        });
    }

    if (hand['action-house'] > 0 && completedSets > 0) {
        const backups = getMoneyPicks(state, { 'action-house': 1 }, 2);
        addMove(moves, {
            title: 'Play House',
            score: 85 + completedSets * 3,
            steps: buildPrimaryMove('House', 1, backups),
            reason:
                'Houses increase the pressure and turn future Rent plays into bigger threats on 3-card sets.',
        });
    }

    if (hand['action-hotel'] > 0 && completedSets > 0) {
        const backups = getMoneyPicks(state, { 'action-hotel': 1 }, 2);
        addMove(moves, {
            title: 'Play Hotel',
            score: 90 + completedSets * 3,
            steps: buildPrimaryMove('Hotel', 1, backups),
            reason:
                'Hotels give the biggest immediate rent upside if you already have a complete set with a house.',
        });
    }

    if (hand['action-pass-go'] > 0) {
        const backups = getMoneyPicks(state, { 'action-pass-go': 1 }, 2);
        addMove(moves, {
            title: 'Play Pass Go',
            score: 65 + parseInt(state.opponents / 2, 10),
            steps: buildPrimaryMove('Pass Go', 1, backups),
            reason:
                'A dependable way to increase hand size and banked money when no stronger tactical strike is available.',
        });
    }
}

function scoreMoneyFallback(state, hand, moves) {
    const backups = getMoneyPicks(state, {}, 3);
    if (backups.length === 0) {
        return;
    }

    const moneyTotal = backups.reduce((acc, card) => acc + card.value, 0);
    const moveText = backups.map((card) => ({ ...card, qty: 1, type: 'primary' }));

    addMove(moves, {
        title: 'Bank your best money cards',
        score: 48 + Math.min(40, moneyTotal),
        steps: moveText,
        reason:
            'When you cannot find a strong set-up play, preserving money keeps your future hand options safer and sets up rent or swaps later.',
    });
}

function generateMoves(state) {
    const moves = [];
    const ownSets = state.ownSets;
    const hand = state.hand;

    scorePropertyMoves(state, ownSets, hand, moves);
    scoreWildMoves(state, ownSets, hand, moves);
    scoreActionMoves(state, ownSets, hand, moves);
    scoreMoneyFallback(state, hand, moves);

    return moves.sort((a, b) => b.score - a.score).slice(0, 3);
}

function renderMoves(moves, state) {
    const container = document.getElementById('moves-list');

    if (!moves.length) {
        container.innerHTML = `
            <div class="empty-state">
                Add some cards to your hand and press "Find next best move".
            </div>
        `;
        return;
    }

    const completeSets = Object.entries(state.ownSets).reduce((acc, [setKey, count]) => {
        return acc + (count >= PROPERTY_SETS[setKey].target ? 1 : 0);
    }, 0);

    const moveCards = moves
        .map((move, index) => {
            const confidence = Math.min(96, 58 + Math.max(0, move.score / 5)).toFixed(0);
            const steps = move.steps
                .map((step, i) => {
                    if (step.type === 'backup') {
                        return `<li>${step.qty}x ${step.name} as backup money</li>`;
                    }
                    return `<li>${step.qty}x ${step.name} ${i === 0 ? '(Primary action)' : ''}</li>`;
                })
                .join('');

            return `
                <article class="move">
                    <h3>
                        ${index + 1}. ${move.title}
                        <span class="pill">~${confidence}% confidence</span>
                    </h3>
                    <p>${move.reason}</p>
                    <ul class="play-list">
                        ${steps}
                    </ul>
                </article>
            `;
        })
        .join('');

    container.innerHTML = `
        <p class="hint">
            You currently have <strong>${completeSets}</strong> completed set(s) and <strong>${state.yourBank}</strong>
            money banked. Keep at most 7 cards in hand after this turn if possible.
        </p>
        ${moveCards}
    `;
}

function analyze() {
    const state = readGameState();
    const moves = generateMoves(state);
    renderMoves(moves, state);
}

function fillSample() {
    const sample = {
        opponents: 3,
        opponentMoney: 8,
        opponentSets: 2,
        yourBank: 2,
        ownSets: {
            brown: 1,
            lightblue: 2,
            pink: 0,
            orange: 1,
            red: 0,
            yellow: 3,
            green: 1,
            blue: 0,
            railroad: 1,
            utility: 1,
        },
        hand: {
            'money-1': 1,
            'money-2': 2,
            'money-3': 1,
            'money-4': 1,
            'money-5': 1,
            'money-10': 1,
            'prop-red': 1,
            'prop-yellow': 1,
            'prop-brown': 1,
            'wild-black': 1,
            'action-deal-breaker': 1,
            'action-rent': 1,
            'action-double-rent': 1,
            'action-sly-deal': 1,
            'action-birthday': 1,
        },
    };

    document.getElementById('opponents').value = sample.opponents;
    document.getElementById('opponent-money').value = sample.opponentMoney;
    document.getElementById('opponent-sets').value = sample.opponentSets;
    document.getElementById('your-bank').value = sample.yourBank;

    Object.entries(sample.ownSets).forEach(([setKey, value]) => {
        const input = document.getElementById(`set-${setKey}`);
        if (input) input.value = value;
    });

    cardDefinitions.forEach((card) => {
        const el = document.getElementById(card.id);
        if (!el) return;
        el.value = sample.hand[card.id] || 0;
    });

    analyze();
}

function resetInputs() {
    document.getElementById('opponents').value = 3;
    document.getElementById('opponent-money').value = 8;
    document.getElementById('opponent-sets').value = 1;
    document.getElementById('your-bank').value = 3;

    Object.keys(PROPERTY_SETS).forEach((setKey) => {
        document.getElementById(`set-${setKey}`).value = 0;
    });

    cardDefinitions.forEach((card) => {
        document.getElementById(card.id).value = 0;
    });

    const moves = [];
    renderMoves(moves, readGameState());
}

window.addEventListener('DOMContentLoaded', () => {
    renderSetGrid();
    renderHandGrid();

    document.getElementById('analyze-btn').addEventListener('click', analyze);
    document.getElementById('sample-btn').addEventListener('click', fillSample);
    document.getElementById('reset-btn').addEventListener('click', resetInputs);

    const initialMoves = [];
    renderMoves(initialMoves, readGameState());
});
