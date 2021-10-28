import { PackageId, QueryParams } from "@src/js/type/entity"
import { useLocation } from "react-router-dom"


export const useUrlParams = (): QueryParams => {
    return parseQueryParams(location.search)
}

export const useHash = (): PackageId => {
    const location = useLocation()
    const hash = location.hash
    return hash?.slice(1) || ""
}

export const useShowLayersFlag = (): boolean => {
    return (parseQueryParams(location.search).layers || "true") !== "false"
}

const parseQueryParams = (queryString): QueryParams => {
    return queryString.substring(1).split('&').map((p) => p.split('=')).reduce((obj, e) => ({ ...obj, [e[0]]: e[1] }), {});
}