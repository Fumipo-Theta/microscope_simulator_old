import SampleFilter from "../src/js/remote_repo/static/filter_by_category.js"

const rhyolite = {
    "package-name": "Q27_quartz",
    "list-name": {
        "ja": "流紋岩中の石英",
        "en": "Quartz in rhyolite"
    },
    "category": ["rock", "igneous_rock", "volcanic_rock", "rhyolite"]
}
const granite = {
    "package-name": "Grc-1_quartz",
    "list-name": {
        "ja": "花崗岩中の波動消光を示す石英",
        "en": "Quartz showing wavy extinction in granite"
    },
    "category": ["rock", "igneous_rock", "plutonic_rock", "granite"]
}
const greenSchist = {
    "package-name": "green_schist",
    "list-name": {
        "ja": "緑色片岩",
        "en": "A green schist"
    },
    "category": ["rock", "metamorphic_rock", "regional_metamorphic_rock", "schist", "green_schist"]
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
                query: {
                    "category": [
                        ["rock", "igneous_rock", "volcanic_rock", "rhyolite"]
                    ]
                },
                expected: [rhyolite]

            },
            {
                query: {
                    "category": [
                        ["rock", "igneous_rock", "volcanic_rock"]
                    ]
                },
                expected: [rhyolite]

            },
            {
                query: {
                    "category": [
                        ["rock", "igneous_rock", "volcanic_rock", "rhyolite"],
                        ["rock", "plutonic_rock"]
                    ]
                },
                expected: [rhyolite, granite]
            }
        ].forEach(testCase => {
            const sampleFilter = new SampleFilter(testCase.query.category)
            expect(sampleFilter.filter(sampleList)).toStrictEqual(testCase.expected)
        })
    })

    test("should return nothing for empty filter", () => {
        const query = { "category": [] }
        const sampleFilter = new SampleFilter(query.category)
        expect(sampleFilter.filter(sampleList)).toStrictEqual(sampleList)
    })

    test("should not reject sample without category field", () => {
        const sampleList = [
            {
                "package-name": "old_sample",
                "list-name": {
                    "ja": "流紋岩中の石英",
                    "en": "Quartz in rhyolite"
                }
            }
        ]
        const query = { "category": [] }
        const sampleFilter = new SampleFilter(query.category)
        expect(sampleFilter.filter(sampleList)).toStrictEqual(sampleList)
    })
})