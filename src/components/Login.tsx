import { signIn, signOut, useSession } from 'next-auth/react'
import Image from 'next/image'
import NextLink from 'next/link'
import { ReactNode } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { FaGoogle } from 'react-icons/fa'

import Logo from '../../public/logo512.png'

import { OFFLINE_MODE } from '@src/config'
import { onErrorToast } from '@src/hooks/useErrorToast'
import { Button } from '@src/ui/Button'
import { Input } from '@src/ui/Input'
import { LoginReq } from '@src/user/types'

export interface LoginFormProps {
  onSuccess?: () => void
}

export const LoginForm = (props: LoginFormProps) => {
  const { onSuccess } = props
  const { data: session } = useSession()
  const { register, handleSubmit } = useForm<LoginReq>()
  const onSubmit = async (credentials: LoginReq) => {
    try {
      await signIn('otog', { ...credentials, redirect: false })
      toast.success('ลงชื่อเข้าใช้สำเร็จ !')
      onSuccess?.()
    } catch (e: any) {
      onErrorToast(e)
    }
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-4">
        <div className="mx-auto w-[100px]">
          <Image src={Logo} alt="" />
        </div>
        <Input
          {...register('username')}
          type="text"
          placeholder="ชื่อผู้ใช้"
          autoFocus
          required
        />
        <Input
          {...register('password')}
          type="password"
          placeholder="รหัสผ่าน"
          required
        />
        <Button type="submit" colorScheme="otog">
          เข้าสู่ระบบ
        </Button>
        {session ? (
          <Button onClick={() => signOut()}>Sign out here</Button>
        ) : (
          <Button onClick={() => signIn('google')} leftIcon={<FaGoogle />}>
            ลงชื่อเข้าใช้ด้วย Google
          </Button>
        )}
        {!OFFLINE_MODE && (
          <>
            <hr />
            <NextLink href="/register" passHref legacyBehavior>
              <Button as="a">ลงทะเบียน</Button>
            </NextLink>
          </>
        )}
      </div>
    </form>
  )
}

export const CenteredCard = ({ children }: { children: ReactNode }) => {
  return (
    <div className="my-16 mx-auto w-max rounded-md border p-4 shadow-md">
      {children}
    </div>
  )
}
