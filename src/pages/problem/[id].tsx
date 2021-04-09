import { PageContainer } from '@src/components/PageContainer'
import { Title } from '@src/components/Title'
import { useRouter } from 'next/router'
import { FaLightbulb } from 'react-icons/fa'
import Editor, { useMonaco } from '@monaco-editor/react'
import { Button } from '@chakra-ui/button'
import { useHttp } from '@src/utils/api/HttpProvider'
import { useToastError } from '@src/utils/error'
import { Link, SimpleGrid, Spacer } from '@chakra-ui/layout'
import { useProblem } from '@src/utils/api/Problem'
import { Select } from '@chakra-ui/select'
import { ChangeEvent, useState } from 'react'
import { API_HOST } from '@src/utils/api'

const defaultValue = `#include <iostream>

using namespace std;

int main() {
    return 0;
}`

const extension: Record<string, string> = {
  cpp: '.cpp',
  c: '.c',
  python: '.py',
}

export default function WriteProblem() {
  const router = useRouter()
  const { id } = router.query
  const { data: problem } = useProblem(id as string)
  const [language, setLanguage] = useState('cpp')
  const onChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setLanguage(event.target.value)
  }

  const monaco = useMonaco()
  const http = useHttp()
  const { onError } = useToastError()
  const onSubmit = async () => {
    const value = monaco?.editor.getModels()[0].getValue()
    if (value && problem) {
      const blob = new Blob([value])
      const file = new File([blob], `${problem.id}${extension[language]}`)

      const formData = new FormData()
      formData.append('sourceCode', file)
      formData.append('language', language)
      try {
        await http.post(`submission/problem/${id}`, formData)
        router.push('/submission')
      } catch (e) {
        onError(e)
      }
    }
  }

  return (
    <PageContainer dense>
      <Title icon={FaLightbulb}>
        <Link href={`${API_HOST}problem/doc/${id}`} target="_blank">
          {problem?.name}
        </Link>
      </Title>
      {/* {problem && (
          <Text>
            ({problem.timeLimit / 1000} วินาที {problem.memoryLimit} MB)
          </Text>
        )} */}
      <Editor
        height="75vh"
        language={language}
        theme="vs-dark"
        defaultValue={defaultValue}
      />
      <SimpleGrid columns={3} alignItems="flex-end" mt={2}>
        <Select onChange={onChange}>
          <option value="cpp">C++</option>
          <option value="c">C</option>
          <option value="python">Python</option>
        </Select>
        <Spacer />
        <Button onClick={onSubmit}>ส่ง</Button>
      </SimpleGrid>
    </PageContainer>
  )
}

export { getServerSideProps } from '@src/utils/api'
