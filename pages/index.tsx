
import Head from 'next/head'
import { NextPage } from 'next'
import Artcle1 from '../public/article1.jpeg'
import Artcle2 from '../public/article2.jpeg'
import { Article } from '../components/Article'
import { FiArrowDownCircle } from 'react-icons/fi'

const Home: NextPage = () => {
    const articles = [
        { title: 'Les offres de Suzuki', description: "Suzuki vous fait profiter d'offres exceptionnelles du 1er au 30 novembre 2022.", img: Artcle1, link: 'https://www.suzuki-moto.com/actualites-suzuki/les-offres-suzuki-0' },
        { title: 'Nos concessionnaires', description: "Avec autant d'années d'expérience, notre entreprise est à votre disposition pour conseil technique de haute qualité.", img: Artcle2, link: 'https://www.suzuki-moto.com/concessionnaires' },
        { title: 'Nos nouveautés', description: 'Découvrez nos derniers modèles qui vous feront vriez', img: Artcle1, link: 'https://www.suzuki-moto.com/nouveautes' },
    ]
    return (
        <div className='flex h-full flex-col'>
            <Head>
                <title>Suzuki concession & aide | ESGI</title>
                <meta name="description" content="Suzuki concession & aide | ESGI" />
            </Head>
            <div className='w-full h-full'>
                <header
                    className="flex items-center justify-center h-[80vh] mb-12 bg-fixed bg-center bg-cover bg-[url('/bg-homepage.jpeg')]"
                />
                <a href='#article-section' className='relative bottom-8 w-full flex justify-center'>
                    <FiArrowDownCircle className='animate-bounce text-white w-10 h-10 cursor-pointer absolute' />
                </a>
                <div className="w-full h-screen flex flex-col space-y-20 justify-center">
                    <h1 className='mx-auto font-bold text-3xl tracking-[10px]' id='article-section'>A propos de nous !</h1>
                    <div className='flex justify-center space-x-10'>
                        {articles.map((article, index) => (
                            <Article key={index} {...article} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home
