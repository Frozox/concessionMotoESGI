import { NextPage } from "next";
import { useRouter } from "next/router";
import LayoutMessages from "../layout";

const AdminRequest: NextPage = () => {
    const router = useRouter();
    return (
        <LayoutMessages userIdSelected={null}>
            <div onClick={
                () => router.push('/messages/admin-request/1')
            }>TAMER</div>
        </LayoutMessages>
    )
}
export default AdminRequest