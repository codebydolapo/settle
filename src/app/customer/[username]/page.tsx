"use client"

import React, { useEffect, useState } from 'react'
import { gql } from "@apollo/client";
import fetchUser from '../../../../server/fetchUser';
import { GetUserQueryResult } from '../../../../types/getUserQueryResult';

const GET_USER_PROFILE = gql`
  query GetUser($username: String!) {
    user(username: $username) {
      username
      name
      bio
      paymentMethods {
        id
        providerName
        accountDetails
        category
      }
    }
  }
`;

export default async function page({ params }: { params: { username: string } }) {

  const [user, setUser] =
    useState<GetUserQueryResult["user"] | undefined>();

  useEffect(() => {
    fetchUser(params.username).then(setUser);
  }, [params.username]);

  if (!user) return <div className="text-center mt-20">User not found</div>;


  return (
    <main className="min-h-screen bg-slate-50 flex flex-col items-center p-6">
      {/* Profile Header */}
      <div className="text-center mb-8">
        <div className="w-24 h-24 bg-indigo-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-3xl font-bold">
          {user.name?.[0] || user.username[0]}
        </div>
        <h1 className="text-2xl font-bold text-slate-900">@{user.username}</h1>
        <p className="text-slate-500">{user.bio || "Settle my bills below!"}</p>
      </div>

      {/* Payment Links List */}
      <div className="w-full max-w-md space-y-4">
        {user.paymentMethods.map((method: any) => (
          <div
            key={method.id}
            className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm hover:shadow-md transition-shadow flex justify-between items-center"
          >
            <div>
              <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
                {method.category}
              </p>
              <h3 className="text-lg font-bold text-slate-800">{method.providerName}</h3>
              <p className="text-slate-600 font-mono">{method.accountDetails}</p>
            </div>

            <button
              className="bg-slate-100 p-2 rounded-lg hover:bg-indigo-100 text-slate-500 hover:text-indigo-600 transition-colors"
              onClick={() => { /* In a Client Component, we'd add copy logic here */ }}
            >
              Copy
            </button>
          </div>
        ))}
      </div>
    </main>
  )
}

