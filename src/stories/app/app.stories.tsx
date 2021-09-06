import React from "react";
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { SampleListKeys, SampleListItemKeys, SampleCategoryItemKeys, SampleCategoriesKeys } from "@src/js/type/sample";

import { App } from "@src/js/component/app"

const sampleListFixture = {
    [SampleListKeys.ListOfSample]: [
        {
            "package-name": "Q27_quartz",
            "list-name": {
                "ja": "流紋岩中の石英",
                "en": "Quartz in rhyolite"
            },
            "category": [
                "rock",
                "igneous_rock",
                "volcanic_rock",
                "rhyolite"
            ]
        },
        {
            "package-name": "Grc-1_quartz",
            "list-name": {
                "ja": "花崗岩中の波動消光を示す石英",
                "en": "Quartz showing wavy extinction in granite"
            },
            "category": [
                "rock",
                "igneous_rock",
                "plutonic_rock",
                "granite"
            ]
        },
        ...Array(20).fill(0).map((_, i) => {
            const index = i + 1
            return {
                [SampleListItemKeys.PackageName]: `rhyolite_test_sample_${index}`,
                [SampleListItemKeys.ListName]: {
                    "ja": `流紋岩テストサンプル ${index}`,
                    "en": `Rhyolite test sample long long sample name ${index}`
                },
                [SampleListItemKeys.Category]: ["rock", "igneous_rock", "volcanic_rock", "rhyolite"]
            }
        })
    ]
}

const categoriesFixture = {
    [SampleCategoriesKeys.Categories]: [
        {
            [SampleCategoryItemKeys.Id]: "rock",
            [SampleCategoryItemKeys.Label]: {
                "ja": "岩石",
                "en": "Rock"
            },
            [SampleCategoryItemKeys.SubCategories]: [
                {
                    [SampleCategoryItemKeys.Id]: "igneous_rock",
                    [SampleCategoryItemKeys.Label]: {
                        "ja": "火成岩",
                        "en": "Igneous rock"
                    },
                }
            ]
        }
    ]
}

export default {
    title: 'SCOPin/App',
    component: App,
} as ComponentMeta<typeof App>;

const Template: ComponentStory<typeof App> = (args) => <App {...args} />;

export const Primary = Template.bind({})
Primary.args = {
    sampleList: sampleListFixture,
    sampleCategories: categoriesFixture,
    lang: "ja"
}
