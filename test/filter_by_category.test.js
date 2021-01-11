import filterSampleByCategories from "../src/js/remote_repo/static/filter_by_category.js"

const rhyolite = {
    "package-name": "Q27_quartz",
    "list-name": {
        "ja": "流紋岩中の石英",
        "en": "Quartz in rhyolite"
    },
    "category": {
        "rock": ["igneous_rock", "volcanic_rock", "rhyolite"],
        "contains": ["quartz"]
    }
}
const granite = {
    "package-name": "Grc-1_quartz",
    "list-name": {
        "ja": "花崗岩中の波動消光を示す石英",
        "en": "Quartz showing wavy extinction in granite"
    },
    "category": {
        "rock": ["igneous_rock", "plutonic_rock", "granite"],
        "contains": ["quartz"]
    }
}
const greenSchist = {
    "package-name": "green_schist",
    "list-name": {
        "ja": "緑色片岩",
        "en": "A green schist"
    },
    "category": {
        "rock": ["metamorphic_rock", "regional_metamorphic_rock", "schist", "green_schist"],
        "contains": ["chrolite"]
    }
}
const sampleList = [
    rhyolite,
    granite,
    greenSchist
]

describe("filterSampleByCategories", () => {
    test("should return samples whose categories are superset of query", () => {
        [
            {
                query: { "rock": ["rhyolite"] },
                expected: [rhyolite]

            },
            {
                query: { "rock": ["volcanic_rock"] },
                expected: [rhyolite]

            },
            {
                query: { "rock": ["igneous_rock"] },
                expected: [rhyolite, granite]
            }
        ].forEach(testCase => {
            expect(filterSampleByCategories(sampleList, testCase.query)).toStrictEqual(testCase.expected)
        })
    })

    test("should return all samples for empty filter", () => {
        const query = { "rock": [] }
        expect(filterSampleByCategories(sampleList, query)).toStrictEqual(sampleList)
    })

    test("should reject sample without category field", () => {
        const sampleList = [
            {
                "package-name": "old_sample",
                "list-name": {
                    "ja": "流紋岩中の石英",
                    "en": "Quartz in rhyolite"
                }
            }
        ]
        const query = { "rock": [] }
        expect(filterSampleByCategories(sampleList, query)).toStrictEqual([])
    })
})