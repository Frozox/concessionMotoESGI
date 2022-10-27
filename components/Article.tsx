import Image, { StaticImageData } from 'next/image'
import Link from 'next/link'

interface IArticle {
    title: string
    description: string
    img: StaticImageData
    link: string
}

export const Article = ({ img, title, description, link }: IArticle) => {
    return (
        <div className="card w-96 max-h-[480px] min-h-[480px] glass">
            <figure>
                <Image
                    src={img}
                    alt="article1"
                    width={400}
                />
            </figure>
            <div className="card-body">
                <h2 className="card-title">{title}</h2>
                <p>{description}</p>
                <div className="card-actions justify-end">
                    <Link href={link} className="btn btn-primary">En savoir plus !</Link>
                </div>
            </div>
        </div>
    )
}