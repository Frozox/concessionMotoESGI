import { NextPage } from "next";
import LayoutMessages from "./layout";

const MyMessages: NextPage = () => {
    return (
        <LayoutMessages userIdSelected={null}>
            <div className="mx-auto">
                <p className="text-white">Aucune discussion sélectionnée</p>
            </div>
        </LayoutMessages>
    )
}

export default MyMessages