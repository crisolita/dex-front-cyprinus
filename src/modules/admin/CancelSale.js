import { useWeb3React } from '@web3-react/core';
import { Button, Typography, message } from 'antd'
import { Contract } from 'ethers';
import React, { useRef, useState } from 'react'
import { SALE_ABI } from './constants/saleABI';
import { CONFIG } from '../../utils/config';

export function CancelSale() {
  const { library } = useWeb3React();
  const [isSubmitting, setIsSubmitting] = useState(false)
  const sale = useRef(new Contract(CONFIG.SALE_ADDRESS, SALE_ABI, library.getSigner()))

  async function cancelSale() {
    setIsSubmitting(true)
    try {
      const transaction = await sale.current.cancelPhase()
      await transaction.wait()
      message.success("Fase cancelada exitosamente.")
    } catch (error) {
      message.error(error?.data?.message || "Error")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Button
      onClick={cancelSale}
      disabled={isSubmitting}
      loading={isSubmitting}
      type="primary"
      htmlType="submit"
      danger
    >
      Cancelar
    </Button>
  )
}