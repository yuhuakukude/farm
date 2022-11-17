import { Box, Stack, styled, Tooltip, Typography } from '@mui/material'
// import lang from '../../assets/images/lang.png'
import Image from '../Image'
import { useState } from 'react'
import { useI18n } from 'react-simple-i18n'
import { isMobile } from 'react-device-detect'

const LangItem = styled(Typography)`
  background-color: #ffbe01;
  width: 60px;
  height: 30px;
  text-align: center;
  line-height: 30px;
  cursor: pointer;
  border-radius: 4px;
`

export default function Lang() {
  const [open, setOpen] = useState(false)
  const { i18n } = useI18n()
  return (
    <Box margin={'10px 10px'}>
      <Tooltip
        open={open}
        title={
          <Stack spacing={8} padding={8}>
            <LangItem
              onClick={() => {
                setOpen(false)
                i18n.setLang('cn')
              }}
            >
              中文
            </LangItem>
            <LangItem
              onClick={() => {
                setOpen(false)
                i18n.setLang('en')
              }}
            >
              English
            </LangItem>
          </Stack>
        }
      >
        <Stack>
          <Image
            width={isMobile ? 18 : 32}
            onClick={() => {
              setOpen(!open)
            }}
            src={''}
          />
        </Stack>
      </Tooltip>
    </Box>
  )
}
