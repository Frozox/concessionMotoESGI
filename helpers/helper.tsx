
export const handleResponseTab = (data: any, status: 'idle' | 'loading' | 'error' | 'success') => {
    if (status === 'loading') {
        return <div>Loading...</div>
    }
    if (status === 'error') {
        return <div>Error fetching data </div>
    }

    return (
        <div>
            {
                data.map((data: any, index: number) => (
                    <div key={index}> {data.name} </div>
                ))
            }
        </div>
    )
}

export const getInitial = (initial: string) => {
    const initials = initial.match(/\b\w/g) || []
    return (
        (initials.shift() || '') + (initials.pop() || '')
    )
}