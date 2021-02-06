import { GetServerSideProps } from 'next'
import { getServerSideProps as getColorModeProps } from '@src/theme/ColorMode'

import { Container } from '@chakra-ui/react'
import { PageContainer } from '@src/components/PageContainer'
import { ProblemTable } from '@src/components/ProblemTable'

import { getProblems } from '@src/utils/api/Problem'

export default function ProblemPage() {
  return (
    <PageContainer>
      <Container>
        <ProblemTable />
      </Container>
    </PageContainer>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const colorModeProps = await getColorModeProps(context)
  try {
    const problems = await getProblems()
    return { props: { initialData: { problems }, ...colorModeProps } }
  } catch (e) {
    console.log(e)
  }
  return { props: colorModeProps }
}
