import { useState } from 'react';
import { Menu } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import Link from 'next/link';
import auth from '../lib/auth'; // ⬅️ fixed import

const UserMenu = () => {
  const [open, setOpen] = useState(false);
  const { user, logout } = auth; // ⬅️ destructure from auth object

  if (!user) return null;

  return (
    <div className="relative">
      <Menu>
        {({ open }) => (
          <>
            <Menu.Button className="flex items-center text-sm font-medium text-white hover:text-gray-300">
              <span className="sr-only">Open user menu</span>
              {user.name}
              <ChevronDownIcon className="ml-2 h-5 w-5" aria-hidden="true" />
            </Menu.Button>
            <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <Menu.Item>
                {({ active }) => (
                  <Link
                    href="/account"
                    className={`block px-4 py-2 text-sm text-gray-700 ${
                      active ? 'bg-gray-100' : ''
                    }`}
                  >
                    Account
                  </Link>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={logout}
                    className={`block w-full text-left px-4 py-2 text-sm text-gray-700 ${
                      active ? 'bg-gray-100' : ''
                    }`}
                  >
                    Sign out
                  </button>
                )}
              </Menu.Item>
            </Menu.Items>
          </>
        )}
      </Menu>
    </div>
  );
};

export default UserMenu;
