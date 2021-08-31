import React from "react"
import { RecoilRoot } from "recoil"
import { Navigation } from "./navigation/navigation"
import { SampleListContainer } from "./sample_list/sample_list_container"

import { Language } from "@src/js/type/entity"
import { SampleListItem, SampleCategoryItemKeys, SampleList, SampleListKeys, SampleCategories, SampleCategoriesKeys, SampleListItemKeys } from "@src/js/type/sample"

type Props = {
    sampleList: SampleList,
    sampleCategories: SampleCategories,
    toBeShrink: boolean,
    lang: Language,
}

export const App: React.FC<Props> = (arg) => {
    return (
        <RecoilRoot>
            <Navigation></Navigation>
            <SampleListContainer {...arg}></SampleListContainer>
        </RecoilRoot>
    )
}