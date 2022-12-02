import { User } from "@prisma/client";
import { ContactComponent } from "../../components/Contact"
import { useEffect, useState } from "react";

const LayoutMessages = ({ children, userIdSelected }: { children: JSX.Element, userIdSelected: String | null }) => {
    const [searchValue, setSearchValue] = useState('');
    const searchRegex = new RegExp(searchValue, 'i');
    const [contacts, setContacts] = useState<User[]>([])

    useEffect(() => {
        if (contacts.length < 1) {
            fetch('/api/users/contacts', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }).then(res => res.json()).then(setContacts);
        }
    }, [contacts.length]);

    return (
        <div className="w-full h-full py-5 flex justify-start items-center relative">
            <div className="w-full h-full space-y-3 flex justify-start flex-col m-5">
                <input type="text" className="w-full p-3 bg-transparent border rounded-md focus:outline-none" placeholder="Rechercher discussions" value={searchValue} onChange={(e) => setSearchValue(e.target.value)} />
                <div className="grid md:h-[80vh] h-5/6 grid-cols-[minmax(150px,_20%)_10px_minmax(60%,_80%)]">
                    <div className="md:h-[80vh] h-5/6 overflow-y-auto space-y-2">
                        {contacts && contacts.filter((item) => searchRegex.test(`(${item.firstName})|(${item.lastName})`)).map((contact) => (
                            <ContactComponent key={contact.id} user={contact} isSelected={userIdSelected === contact.id} />
                        ))}
                    </div>
                    <div />
                    <div className="grid grid-rows-[minmax(70%,90%)_10%] w-full md:h-[80vh] h-5/6 bg-transparent border rounded items-center text-black p-3 focus:outline-none">
                        {children}
                        <input type="text" className="w-full p-3 bg-transparent border rounded-md focus:outline-none text-white" placeholder="Contenu du message" />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LayoutMessages