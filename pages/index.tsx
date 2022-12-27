
import Head from 'next/head'
import { NextPage } from 'next'
import Artcle1 from '../public/article1.jpeg'
import Artcle2 from '../public/article2.jpeg'
import { Article } from '../components/Article'
import { FiArrowDownCircle } from 'react-icons/fi'
import Link from 'next/link'
import React, { lazy } from 'react'
import { ChatBot } from '../components/Chatbot/ChatBot'

const Home: NextPage = () => {
    const articles = [
        { title: 'Les offres de Suzuki', description: "Suzuki vous fait profiter d'offres exceptionnelles du 1er au 30 novembre 2022.", img: Artcle1, link: 'https://www.suzuki-moto.com/actualites-suzuki/les-offres-suzuki-0' },
        { title: 'Nos concessionnaires', description: "Avec autant d'années d'expérience, notre entreprise est à votre disposition pour conseil technique de haute qualité.", img: Artcle2, link: 'https://www.suzuki-moto.com/concessionnaires' },
        { title: 'Nos nouveautés', description: 'Découvrez nos derniers modèles qui vous feront vriez', img: Artcle1, link: 'https://www.suzuki-moto.com/nouveautes' },
    ]
    const [isShowing, setIsShowing] = React.useState(false)
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
                <div className='fixed bg-white right-8 bottom-8'>
                    <div className={`${isShowing ? 'bg-white text-black' : 'hidden'} rounded-xl absolute right-20 bottom-20 w-[70vh] h-[75vh] overflow-scroll`}>
                        <ChatBot
                            botName='Amin assistant virtuel'
                            isOpen={isShowing}
                        />
                    </div>
                    <div className="h-20 w-20 rounded-full bg-[url('/amin_bg.png')] bg-cover bg-center absolute right-2 bottom-2 bg-white shadow-lg cursor-pointer"
                        onClick={() => setIsShowing(!isShowing)}
                    />
                </div>
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
                <footer className="footer items-center p-4 bg-neutral text-neutral-content">
                    <div className="items-center grid-flow-col">
                        <svg width="36" height="36" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fillRule="evenodd" clipRule="evenodd" className="fill-current"><path d="M22.672 15.226l-2.432.811.841 2.515c.33 1.019-.209 2.127-1.23 2.456-1.15.325-2.148-.321-2.463-1.226l-.84-2.518-5.013 1.677.84 2.517c.391 1.203-.434 2.542-1.831 2.542-.88 0-1.601-.564-1.86-1.314l-.842-2.516-2.431.809c-1.135.328-2.145-.317-2.463-1.229-.329-1.018.211-2.127 1.231-2.456l2.432-.809-1.621-4.823-2.432.808c-1.355.384-2.558-.59-2.558-1.839 0-.817.509-1.582 1.327-1.846l2.433-.809-.842-2.515c-.33-1.02.211-2.129 1.232-2.458 1.02-.329 2.13.209 2.461 1.229l.842 2.515 5.011-1.677-.839-2.517c-.403-1.238.484-2.553 1.843-2.553.819 0 1.585.509 1.85 1.326l.841 2.517 2.431-.81c1.02-.33 2.131.211 2.461 1.229.332 1.018-.21 2.126-1.23 2.456l-2.433.809 1.622 4.823 2.433-.809c1.242-.401 2.557.484 2.557 1.838 0 .819-.51 1.583-1.328 1.847m-8.992-6.428l-5.01 1.675 1.619 4.828 5.011-1.674-1.62-4.829z"></path></svg>
                        <p>Copyright © 2022 - All right reserved - <Link href={'https://github.com/esgi-insomniak'} target={'_blank'} className='underline underline-offset-2 decoration-blue-400'>Insomniak</Link></p>
                    </div>
                    <div className="grid-flow-col gap-4 md:place-self-center md:justify-self-end">
                        <Link href={'https://github.com/TheHikuro'} target={'_blank'} className='underline underline-offset-2 decoration-blue-400'>Loan CLERIS</Link>
                        <Link href={'https://github.com/Frozox'} target={'_blank'} className='underline underline-offset-2 decoration-blue-400'>Tom CUILLANDRE</Link>
                    </div>
                </footer>
            </div>
        </div>
    )
}

export default Home
