import { Box, Grid, IconButton, Stack, Typography } from '@mui/material'
import Image from '../../components/Image'
import titleImg from '../../assets/images/club_title.png'
import headerImg from '../../assets/images/nft_header.png'
import textImg from '../../assets/images/club_text.png'
import num1 from '../../assets/images/num1.png'
import num2 from '../../assets/images/num2.png'
import num3 from '../../assets/images/num3.png'
import num4 from '../../assets/images/num4.png'
import mint_btn from '../../assets/images/mint_btn.png'
import { NFT_ADDRESS, PEA } from '../../constants'
import { ApprovalState, useApproveCallback } from '../../hooks/useApproveCallback'
import { tryParseAmount } from '../../utils/parseAmount'
import { useCallback } from 'react'
import TransactionPendingModal from '../../components/Modal/TransactionModals/TransactionPendingModal'
import TransactionSubmittedModal from '../../components/Modal/TransactionModals/TransactiontionSubmittedModal'
import MessageBox from '../../components/Modal/TransactionModals/MessageBox'
import { useNFT } from '../../hooks/useNFT'
import useModal from '../../hooks/useModal'
import nftBG from '../../assets/images/nft_bg.png'
import save from '../../assets/images/save.png'
import myNFT from '../../assets/images/my_nft.png'
import JSBI from 'jsbi'

export default function NFT() {
  const payAmount = tryParseAmount('8000', PEA[8989])
  const [approvalState, approveCallback] = useApproveCallback(payAmount, NFT_ADDRESS)
  const { mint, nfts } = useNFT()
  const { showModal, hideModal } = useModal()
  console.log('nfts', nfts)
  const mintCallback = useCallback(async () => {
    showModal(<TransactionPendingModal />)
    mint()
      .then(() => {
        hideModal()
        showModal(<TransactionSubmittedModal />)
      })
      .catch((err: any) => {
        hideModal()
        showModal(
          <MessageBox type="error">{err.error && err.error.message ? err.error.message : err?.message}</MessageBox>
        )
        console.error(err)
      })
  }, [hideModal, mint, showModal])

  return (
    <Box>
      <Stack sx={{ width: '100%', alignItems: 'center', marginTop: 30, paddingBottom: 40 }}>
        <Image src={titleImg} height={36} style={{ margin: 'auto' }} />
      </Stack>
      <Image src={headerImg} style={{ margin: 30, overflow: 'hidden' }} />
      <Image height={24} src={textImg} style={{ margin: 30 }} />
      <Stack margin={30} direction={'row'} alignItems={'center'} spacing={10}>
        <Image height={24} src={num1} />
        <Typography fontSize={18} fontWeight={500}>
          营销钱包25%分红
        </Typography>
      </Stack>
      <Stack margin={30} direction={'row'} alignItems={'center'} spacing={10}>
        <Image height={24} src={num2} />
        <Typography fontSize={18} fontWeight={500}>
          空投游戏盲盒
        </Typography>
      </Stack>
      <Stack margin={30} direction={'row'} alignItems={'center'} spacing={10}>
        <Image height={24} src={num3} />
        <Typography fontSize={18} fontWeight={500}>
          永久豌豆IDO抽取白名单
        </Typography>
      </Stack>
      <Stack margin={30} direction={'row'} alignItems={'center'} spacing={10}>
        <Image height={24} src={num4} />
        <Typography fontSize={18} fontWeight={500}>
          其他福利随时增加%分红
        </Typography>
      </Stack>
      <IconButton
        onClick={approvalState === ApprovalState.NOT_APPROVED ? approveCallback : mintCallback}
        sx={{ borderRadius: 0 }}
      >
        <Image width={'100%'} src={mint_btn} />
      </IconButton>
      <Image style={{ height: 20, margin: 20 }} src={myNFT} />
      <Grid container spacing={20}>
        {nfts
          .filter(value => {
            return !!value
          })
          .map(value => {
            return (
              <Grid key={value} item xs={6}>
                <Stack
                  sx={{
                    background: `url(${nftBG})`,
                    backgroundSize: '100% 101%',
                    backgroundRepeat: 'no-repeat',
                    padding: '2px 8px 4px 2px',
                    position: 'relative'
                  }}
                >
                  <Image
                    style={{ borderRadius: '10px' }}
                    src={`https://gateway.pinata.cloud/ipfs/bafybeieorpxjvnifejdszn2r7lee23ddpiom6fcte2b2yh2gkraox2qyki/${value}.png`}
                  />
                  <IconButton
                    sx={{ width: 'fit-content', alignSelf: 'end', marginBottom: 20 }}
                    onClick={() => {
                      window.open(
                        `https://gateway.pinata.cloud/ipfs/bafybeieorpxjvnifejdszn2r7lee23ddpiom6fcte2b2yh2gkraox2qyki/${value}.png`,
                        '_blank'
                      )
                    }}
                  >
                    <Image height={30} src={save} />
                  </IconButton>
                  <Typography
                    sx={{
                      bottom: 55,
                      position: 'absolute',
                      backgroundColor: 'black',
                      color: 'white',
                      padding: '10px 20px',
                      borderRadius: '0 5px 5px 0'
                    }}
                  >
                    编号 &nbsp;{JSBI.ADD(JSBI.BigInt(value), JSBI.BigInt(1))}
                  </Typography>
                </Stack>
              </Grid>
            )
          })}
      </Grid>
    </Box>
  )
}
