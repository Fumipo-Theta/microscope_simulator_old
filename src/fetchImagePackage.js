export default function fetchImagePackage(fetcher, response, toBeFetch) {
    return async state => {
        if (!toBeFetch) return [state, response];

        const new_response = Object.assign(
            response,
            { zip: await fetcher() }
        )
        return [state, new_response]
    }
}
