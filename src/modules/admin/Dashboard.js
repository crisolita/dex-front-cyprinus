import { useWeb3React } from '@web3-react/core';
import { Spin, Typography } from 'antd';
import { Contract, ethers } from 'ethers'
import React, { useEffect, useRef, useState } from 'react'
import { CancelSale } from './CancelSale';
import { SALE_ABI } from './constants/saleABI'
import { CONFIG } from '../../utils/config';

export function Dashboard() {
    const { library } = useWeb3React();
    const [phase, setPhase] = useState()
    const [loading, setLoading] = useState(true)
    const sale = useRef(new Contract(CONFIG.SALE_ADDRESS, SALE_ABI, library.getSigner()))

    useEffect(() => {
        async function get() {
            try {
                const phase = await sale.current.getcurrentPhase()
                setPhase({
                    endAt: new Date(+phase.endAt.toString() * 1000),
                    isPublic: phase.isPublic,
                    minimunEntry: ethers.utils.formatEther(phase.minimunEntry.toString()),
                    over: phase.over,
                    price: ethers.utils.formatEther(phase.price.toString()),
                    supply: ethers.utils.formatEther(phase.supply.toString()),
                    timelock: phase.timelock.toString()
                })
            } finally {
                setLoading(false)
            }
        }
        get()
    }, [])

    if (loading) return <Spin size='large' />

    return (
        <div style={{ display: 'flex', flexDirection: 'column', maxWidth: '80%', justifyContent: 'center', alignItems: 'center', margin: '0 auto' }}>
            <div>
                <Typography.Title>Fase actual: {phase.over ? 'Finalizada' : 'En progreso'}</Typography.Title>
                <p>Fecha fin: {phase.endAt.toString()}</p>
                <p>Tokens restantes: {phase.supply}</p>
                <p>Precio: {phase.price}$</p>
                <p>Compra mínima: {phase.minimunEntry}</p>
                <p>Tipo de fase: {phase.isPublic ? "pública" : "Privada"}</p>
                <p>Tiempo de bloqueo: {phase.timelock / 3600 / 24} días</p>
                <CancelSale />
            </div>
        </div>
    )
}