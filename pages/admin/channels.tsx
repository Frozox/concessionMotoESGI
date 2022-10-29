import { SelectableItemTable } from "../../components/SelectableItemTable"
import { LayoutAdmin } from "./layout"

const AdminChannels = () => {
    const channels = [
        { id: '1', title: "J'ai un probleme avec mon pot d'échapement", members: ['Loan', 'Tom', 'Raph'], capacity: 10, owner: { email: 'loan.cleris@gmail.com', firstName: 'Loan', lastName: 'Cleris' }, createdAt: '03/11/2022', status: true },
        { id: '2', title: "J'ai pas assez de vitesse que dois-je faire ? ", members: ['Loan', 'Tom', 'Raph'], capacity: 10, owner: { email: 'test@test.fr', firstName: 'Tom', lastName: 'Cuillandre' }, createdAt: '04/11/2022', status: false },
    ]
    return (
        <LayoutAdmin>
            <div className="space-y-2">
                {
                    channels.map((channel, index) => (
                        <SelectableItemTable
                            {...channel}
                            key={index}
                        />
                    ))
                }
            </div>
        </LayoutAdmin>
    )
}

export default AdminChannels