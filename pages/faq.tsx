import { Faq } from "@prisma/client";
import { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { Fragment } from "react";
import { useQuery } from "react-query";
import { DisclosureComp } from "../components/Disclosure";

const FAQ: NextPage = () => {
    const { data: myFaqs } = useQuery<Faq[]>('faqs', () => fetch('/api/faq').then(res => res.json()))

    return (
        <Fragment>
            <Head>
                <title>FAQ | Suzuki - ESGI</title>
            </Head>
            <div className='w-full p-5'>
                <div className='w-full bg-white rounded-xl p-3 space-y-3'>
                    {myFaqs && myFaqs.map((faq: Faq, index: number) => (
                        <DisclosureComp value={faq} key={index} />
                    ))}
                    <div className='flex justify-center'>
                        <span className='text-gray-700 mr-1'>Vous ne trouvez pas les réponses à vos questions ? Essayer le</span>
                        <Link href={'/forum'} className='font-semibold tracking-tight text-blue-500 hover:underline decoration-blue-500/2'>Forum</Link>
                    </div>
                </div>
            </div>
        </Fragment>
    )
}

export default FAQ