import Head from 'next/head';
import * as React from 'react';
import { Inter } from '@next/font/google';
import Card from '@/components';

const inter = Inter({ subsets: ['latin'] });

const getMemesData = async () => {
    const res = await fetch('https://api.imgflip.com/get_memes');
    const data = await res.json();
    const memesData = data?.data?.memes;
    const formatedMemesData = memesData?.map((meme: any) => ({ id: meme.id, url: meme.url }));
    return formatedMemesData.slice(0, 50);
};

export default function HomePage(props: any) {
    const [data, setData] = React.useState<any>();

    React.useEffect(() => {
        let storedMemes: any = JSON.parse(localStorage.getItem('memesData'));

        if (storedMemes) setData(storedMemes);
        if (!storedMemes) {
            // Converting Array into Object
            let dataById = props.data.reduce((accumulator: any, currentValue: any) => {
                accumulator[currentValue.id] = currentValue;
                return accumulator;
            }, {});
            localStorage.setItem('memesData', JSON.stringify(dataById));
            setData(dataById);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.data]);

    const handleDelete = (id: any) => {
        // create a new object with the key-value pair removed
        const newData = Object.keys(data).reduce((acc: any, curr: any) => {
            if (curr !== id) {
                acc[curr] = data[curr];
            }
            return acc;
        }, {});

        setData(newData);

        // save the newData to local storage so that they never get re-rendered upon page refresh
        localStorage.setItem('memesData', JSON.stringify(newData));
    };

    return (
        <div className='m-10'>
            <Head>
                <title>Create Next App</title>
                <meta name='description' content='Generated by create next app' />
                <meta name='viewport' content='width=device-width, initial-scale=1' />
                <link rel='icon' href='/favicon.ico' />
            </Head>
            <div className=' text-center text-4xl my-4 shadow-white max-w-md p-2 rounded-md m-auto text-black bg-slate-100 shadow-md'>Memes Templates</div>
            <div className='grid grid-cols-12 gap-7 mt-10'>
                {data &&
                    Object.keys(data).map((id) => (
                        <div className='col-span-6 sm:col-span-6 md:col-span-3' key={id}>
                            <Card id={id} url={data[id].url} alt={`Image with ID: ${id}`} handleDelete={handleDelete} />
                        </div>
                    ))}
            </div>
        </div>
    );
}

export async function getStaticProps() {
    const data = await getMemesData();
    return { props: { data } };
}
