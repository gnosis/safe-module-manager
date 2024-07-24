import React, { useState } from 'react'
import { Typography, makeStyles } from '@material-ui/core'
import { ConnextModuleParams, deployConnextModule, getConnextAddress } from 'services'
import { ReactComponent as ArrowUpIcon } from '../../../../assets/icons/arrow-up-icon.svg'
import useSafeAppsSDKWithProvider from 'hooks/useSafeAppsSDKWithProvider'
import { ParamInput } from '../../../../components/ethereum/ParamInput'
import { ActionButton } from '../../../../components/ActionButton'
import { AddModuleModal } from '../components/AddModuleModal'
import { ParamType } from 'ethers'

interface ConnextModuleProps {
  open: boolean
  onClose?(): void
  onSubmit?(): void
}

const useStyles = makeStyles((theme) => ({
  addButton: {
    marginTop: theme.spacing(2),
  },
  addTransactionButton: {
    marginTop: theme.spacing(1),
  },
  addIcon: {
    stroke: theme.palette.common.white,
    width: 20,
    height: 20,
  },
  inputParam: {
    marginTop: theme.spacing(2),
  },
  errorMessage: {
    marginTop: theme.spacing(1),
    color: 'red',
  },
}))

export const ConnextModuleModal = ({ onSubmit, open, onClose }: ConnextModuleProps) => {
  const { sdk, safe, provider } = useSafeAppsSDKWithProvider()
  const classes = useStyles()

  const [errors, setErrors] = useState<Record<keyof ConnextModuleParams, boolean>>({
    owner: false,
    avatar: false,
    target: false,
    domainId: true,
    sender: true,
  })

  const [params, setParams] = useState<ConnextModuleParams>({
    owner: safe.safeAddress,
    avatar: safe.safeAddress,
    target: safe.safeAddress,
    domainId: 0,
    sender: '',
  })

  const onParamChange = <Field extends keyof ConnextModuleParams>(
    field: Field,
    value: ConnextModuleParams[Field],
    valid?: boolean,
  ) => {
    setErrors({ ...errors, [field]: !valid })
    setParams({
      ...params,
      [field]: value,
    })
  }

  const handleAddConnextModule = async () => {
    try {
      const args = {
        ...params,
      }
      const txs = await deployConnextModule(provider, safe.safeAddress, safe.chainId, args)

      await sdk.txs.send({ txs })
      if (onSubmit) onSubmit()
      if (onClose) onClose()
    } catch (error) {
      console.error('Error deploying module: ', error)
    }
  }

  return (
    <AddModuleModal
      hideButton
      open={open}
      onClose={onClose}
      title='Connext Module'
      description='This module allows for execution of transactions initiated by a designated address on the other chain via Connext.'
      tags={['From Connext']}
      icon='connext'
      readMoreLink='https://github.com/gnosis/zodiac-module-connext/'
    >
      <Typography gutterBottom>Parameters</Typography>

      <ParamInput
        placeholder='Origin Sender Address'
        label='Origin sender address'
        param={ParamType.from('address')}
        onChange={(value, valid) => onParamChange('sender', value, valid)}
      />

      <ParamInput
        placeholder='Connext origin domain ID'
        label='Connext origin domain ID'
        className={classes.inputParam}
        param={ParamType.from('uint256')}
        onChange={(value, valid) => onParamChange('domainId', value, valid)}
      />

      <Typography className={classes.errorMessage}>
        {!getConnextAddress(safe.chainId) ? 'Not supported network for the Module' : null}
      </Typography>

      <ActionButton
        fullWidth
        disableElevation
        className={classes.addButton}
        variant='contained'
        disabled={errors.domainId || errors.sender || !getConnextAddress(safe.chainId)}
        startIcon={<ArrowUpIcon />}
        onClick={handleAddConnextModule}
      >
        Add Module
      </ActionButton>
    </AddModuleModal>
  )
}
