import { useFarmInfos } from '../../hooks/useFarmInfos'
import { Box, Stack, styled, Typography } from '@mui/material'

const Wrapper = styled(Box)`
  border: 2px solid #191919;
  box-shadow: 6px 6px 0px 0px #191919;
  border-radius: 12px;
`

const Dot = styled(Box)`
  width: 48px;
  height: 48px;
  border-radius: 24px;
  border: 2px solid #191919;
  box-shadow: 4px 4px 0px 0px #191919;
`

const RowBetween = styled(Stack)`
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
`

export default function Farms() {
  const farms = useFarmInfos()
  return (
    <Wrapper sx={{ width: 100, margin: 10 }}>
      {farms.map(farm => {
        return (
          <RowBetween key={farm.base.lpAddress}>
            <Stack direction={'row'}>
              <Dot />
              <Typography>
                {farm.base.token0Name}
                {farm.base.token1Name}
              </Typography>
            </Stack>
          </RowBetween>
        )
      })}
    </Wrapper>
  )
}
