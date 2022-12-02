import { NextPage } from "next";
import LayoutMessages from "./layout";

const MyMessages: NextPage = () => {
    return (
        <LayoutMessages userIdSelected={null}>
            <div>
                <p className="text-white">Aucune conversation sélectionnée</p>
            </div>
        </LayoutMessages>
    )
}

export default MyMessages