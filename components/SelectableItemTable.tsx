import { Fragment } from "react"
import useModal from "../helpers/hooks/Modal/useModal"
import { Modal } from "./Modal"

export interface IItemTableProps {
    title: string
    members: string[]
    capacity: number
    id: string
    owner: { email: string, firstName: string, lastName: string }
    createdAt: string
    status: boolean
    content: JSX.Element
}

export const SelectableItemTable = (
    { content, title, members, capacity, id, owner, status, createdAt }: IItemTableProps
) => {
    const { toggle, isShowing } = useModal()
    return (
        <Fragment>
            <div
                className="w-full p-3 rounded-lg shadow-lg hover:shadow-xl flex justify-between items-center bg-white cursor-pointer "
                onClick={toggle}
                key={id}
            >
                <div className="w-fit">{title}</div>
                <div className="space-x-20 flex justify-evenly items-start w-2/3">
                    <div className="w-fit min-w-[10rem]">{members.length}/{capacity}</div>
                    <div className="w-fit min-w-[10rem]">{owner.firstName} {owner.lastName}</div>
                    <div className="w-fit min-w-[10rem]">{createdAt}</div>
                    <div className="w-fit min-w-[10rem]">{status
                        ? (
                            <span className="text-green-500">Active</span>
                        ) :
                        (
                            <span className="text-red-500">Fermé</span>
                        )}
                    </div>
                </div>
            </div>
            <Modal
                isShowing={isShowing}
                toggle={toggle}
                title={title}
                content={content}
            />
        </Fragment>
    )
}