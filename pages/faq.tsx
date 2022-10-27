import { NextPage } from "next";
import Link from "next/link";
import { useQuery } from "react-query";
import { DisclosureComp } from "../components/Disclosure";
import { IDisclosure } from "./api/disclosure";

const FAQ: NextPage = () => {
    const { data: myFaqs } = useQuery<IDisclosure[]>('faqs', () => fetch('/api/disclosure').then(res => res.json()))

    return (
        <div className='w-full p-5'>
            <div className='w-full bg-white rounded-xl p-3 space-y-3'>
                {
                    myFaqs && myFaqs.map((faq: IDisclosure) => (
                        <DisclosureComp value={faq} />
                    ))
                }
                <div className='flex justify-center'>
                    <span className='text-gray-700 mr-1'>Vous ne trouvez pas les réponses à vos questions ? Essayer le</span>
                    <Link href={'/forum'} className='font-semibold tracking-tight text-blue-500 hover:underline decoration-blue-500/2'>Forum</Link>
                </div>
            </div>
        </div>
    )
}

export default FAQ