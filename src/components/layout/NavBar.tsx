import clsx from 'clsx'
import Image from 'next/image'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { ForwardedRef, useEffect, useRef } from 'react'

import Logo from '../../../public/logo512.png'
import { Avatar } from '../Avatar'
import { ToggleColorModeButton } from '../ToggleColorModeButton'
import { PageContainer } from './PageContainer'
import { SearchMenu } from './SearchMenu'

import { OFFLINE_MODE } from '@src/config'
import { useUserData } from '@src/context/UserContext'
import { useDisclosure } from '@src/hooks/useDisclosure'
import { ChevronDownIcon } from '@src/icons/ChevronDownIcon'
import { HamburgerIcon } from '@src/icons/HamburgerIcon'
import { useUserSmallAvatar } from '@src/profile/useAvartar'
import { Button, ButtonProps } from '@src/ui/Button'
import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
} from '@src/ui/Drawer'
import { IconButton } from '@src/ui/IconButton'
import { Link } from '@src/ui/Link'
import { Menu, MenuButton, MenuItem, MenuList } from '@src/ui/Menu'

function usePathActive(href: string) {
  const { pathname } = useRouter()
  return href.split('/')[1] === pathname.split('/')[1]
}

export const NavBar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const btnRef = useRef(null)

  const router = useRouter()
  useEffect(() => {
    router.events.on('routeChangeComplete', onClose)
    return () => {
      router.events.off('routeChangeComplete', onClose)
    }
  }, [router, onClose])

  const { isAuthenticated, user, isAdmin, logout } = useUserData()
  const { url } = useUserSmallAvatar()

  const entries =
    !OFFLINE_MODE || isAdmin
      ? [
          { href: '/problem', title: 'โจทย์' },
          {
            href: isAdmin ? '/submission/all' : '/submission',
            title: 'ผลตรวจ',
          },
          { href: '/contest', title: 'แข่งขัน' },
        ]
      : []

  return (
    <>
      <div className="fixed left-0 top-0 z-20 h-14 w-full border-b bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <PageContainer className="flex">
          <NextLink
            passHref
            legacyBehavior
            href={isAdmin ? '/admin/contest' : '/'}
          >
            <Link className="flex items-center text-gray-800 dark:text-white">
              <Image
                src={Logo}
                width={32}
                height={32}
                alt="One Tambon One Grader Logo"
              />
            </Link>
          </NextLink>
          <div className="ml-10 hidden gap-6 sm:flex">
            {entries.map((item) => (
              <NavItem key={item.href} {...item} />
            ))}
          </div>
          <div className="flex-1" />
          <div className="py-2">
            <SearchMenu />
          </div>
          <div className="ml-2 hidden gap-2 py-2 sm:flex">
            <ToggleColorModeButton
              variant="ghost"
              className="hidden sm:inline-flex "
            />
            {user && <AvatarMenu />}
          </div>
          {!user && (
            <div className="ml-2 hidden sm:flex">
              <NavItem href="/login" title="เข้าสู่ระบบ" />
            </div>
          )}
          <IconButton
            className="my-2 p-2 sm:hidden"
            variant="ghost"
            aria-label="Open menu"
            onClick={onOpen}
            icon={<HamburgerIcon />}
            ref={btnRef}
          />
        </PageContainer>
      </div>
      <Drawer isOpen={isOpen} onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerBody>
            <div className="mr-6 mt-2 flex flex-col items-start gap-3">
              {user && (
                <NextLink passHref legacyBehavior href={`/profile/${user.id}`}>
                  <DrawerButton>
                    <div className="flex items-center gap-2 py-2">
                      <Avatar src={url} name={user.showName} />
                      <div className="line-clamp-1"> {user.showName}</div>
                    </div>
                  </DrawerButton>
                </NextLink>
              )}
              {entries.map((item) => (
                <DrawerItem key={item.href} {...item} />
              ))}
              {isAuthenticated ? (
                <DrawerButton
                  className="text-red-500 dark:text-red-500"
                  onClick={logout}
                >
                  ออกจากระบบ
                </DrawerButton>
              ) : (
                <DrawerItem href="/login" title="เข้าสู่ระบบ" />
              )}
              <ToggleColorModeButton />
            </div>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
      <div className="h-14 w-full bg-transparent" />
    </>
  )
}
interface ItemProps {
  href: string
  title: string
  active?: boolean
}

const NavItem = (props: ItemProps) => {
  const { href, title, ...rest } = props
  const isActive = usePathActive(href)
  const { pathname } = useRouter()
  return (
    <NextLink passHref legacyBehavior href={href}>
      <Link
        scroll={pathname === href}
        variant="nav"
        className="flex items-center border-y-2 border-transparent px-2 py-2 font-medium tracking-wide !no-underline hover:border-b-gray-400 active:border-b-otog-400"
        isActive={isActive}
        {...rest}
      >
        {title}
      </Link>
    </NextLink>
  )
}

const DrawerItem = (props: ItemProps) => {
  const { href, title, active, ...rest } = props
  const isActive = usePathActive(href) || active
  const { pathname } = useRouter()
  return (
    <NextLink passHref legacyBehavior href={href}>
      <DrawerButton
        scroll={pathname === href}
        className={
          isActive
            ? 'text-gray-800 dark:text-white'
            : 'text-gray-500 dark:text-gray-400'
        }
        {...rest}
      >
        {title}
      </DrawerButton>
    </NextLink>
  )
}

const DrawerButton = (
  { className, children, ...props }: ButtonProps,
  ref: ForwardedRef<HTMLButtonElement>
) => {
  return (
    <Button
      variant="ghost"
      fullWidth
      className={clsx('justify-start px-2 font-normal', className)}
      {...props}
      ref={ref}
    >
      {children}
    </Button>
  )
}

const AvatarMenu = () => {
  const { user, isAdmin, logout } = useUserData()
  const { url } = useUserSmallAvatar()
  return (
    <Menu>
      <div className="flex items-center gap-2">
        {OFFLINE_MODE && !isAdmin && <span>สวัสดี {user?.showName}</span>}
        <MenuButton
          as={Button}
          variant="ghost"
          className="px-2 text-gray-500"
          rightIcon={<ChevronDownIcon />}
        >
          <Avatar src={url} name={user!.showName} />
        </MenuButton>
      </div>
      {/* fix render menulist on ssr */}
      <MenuList>
        {!OFFLINE_MODE && (
          <NextLink passHref legacyBehavior href={`/profile/${user?.id}`}>
            <MenuItem>โปรไฟล์</MenuItem>
          </NextLink>
        )}
        <MenuItem className="text-red-500 dark:text-red-500" onClick={logout}>
          ออกจากระบบ
        </MenuItem>
      </MenuList>
    </Menu>
  )
}
