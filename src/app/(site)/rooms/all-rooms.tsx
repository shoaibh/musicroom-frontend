"use client";

import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { Room } from './room';

export const AllRooms = ({jwt}: {jwt: string}) => {
    
    const {  data } = useQuery({
        queryKey: ['all_rooms', jwt],
        queryFn: () =>
        fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/room/`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              jwtToken: `${jwt}`,
            },
          }
        ).then(
            (res) => res.json(),
          ),
      })
    
    return (
      <>
      <div>AllRooms</div>
      {data?.data?.map((r: Room) => (
          <Room name={r.name} id={r.id} key={r.id} />
        ))}
      </>
  )
}
