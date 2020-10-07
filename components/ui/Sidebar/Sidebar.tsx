import cn from 'classnames'
import { FC } from 'react'
import s from './Sidebar.module.css'
import { Transition } from '@headlessui/react'
interface Props {
  className?: string
  children?: any
  show?: boolean
}

const Sidebar: FC<Props> = ({ className, children, show = true }) => {
  const rootClassName = cn(s.root, className)
  return (
    <Transition show={show}>
      <div className={rootClassName}>
        <div className="absolute inset-0 overflow-hidden">
          <Transition.Child
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="absolute inset-0 bg-black bg-opacity-25 transition-opacity" />
          </Transition.Child>
          <section className="absolute inset-y-0 right-0 pl-10 max-w-full flex sm:pl-16">
            <Transition.Child
              enter="transition ease-in-out duration-300 transform"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full"
            >
              <div className="h-full w-screen max-w-2xl">
                <div className="h-full flex flex-col space-y-6 bg-white shadow-xl overflow-y-auto">
                  {children}
                </div>
              </div>
            </Transition.Child>
          </section>
        </div>
      </div>
    </Transition>
  )
}

export default Sidebar