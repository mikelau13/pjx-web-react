import React from 'react';
import { GET_CITIES } from '../graphql/queries';
import { useQuery } from '@apollo/react-hooks';
import { withApollo } from '../apollo/initApollo';

const Cities = () => {
    const { loading, error, data } = useQuery(GET_CITIES);
    if (error) return <h1>Error</h1>;
    if (loading) return <h1>Loading...</h1>;

    return (
        <div>
            <h1>
                <h3>All Cities</h3>
            </h1>
            <div>
                {data.cities.map((data:any) => (
                    <ul key={data.id}>
                        <li>{data.name}</li>
                    </ul>
                ))}
            </div>
        </div>
    );
};

export default withApollo({ ssr: true })(Cities);
