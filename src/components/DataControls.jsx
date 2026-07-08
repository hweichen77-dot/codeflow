import React, { useState } from 'react'
import { font, color } from '@/lib/tokens'
import { useAuth } from '@/lib/AuthContext'
import { toast } from '@/components/ui/use-toast'
import { exportUserData, deleteLocalData, deleteAccountAndData } from '@/lib/dataRights'

const btnBase = {
  fontFamily: font.body,
  fontSize: '0.9rem',
  fontWeight: 600,
  padding: '10px 18px',
  borderRadius: 10,
  cursor: 'pointer',
  transition: 'opacity .15s',
}

export default function DataControls() {
  const { isAuthenticated, authMode } = useAuth()
  const isAccount = isAuthenticated && authMode === 'email'
  const [busy, setBusy] = useState(null)
  const [confirming, setConfirming] = useState(false)

  const onExport = async () => {
    setBusy('export')
    try {
      await exportUserData()
      toast({ title: 'Data exported', description: 'A JSON file with all your CodeFlow data was downloaded.' })
    } catch {
      toast({ title: 'Export failed', description: 'Could not build your data file. Try again.', variant: 'destructive' })
    } finally {
      setBusy(null)
    }
  }

  const onDelete = async () => {
    setBusy('delete')
    try {
      if (isAccount) {
        await deleteAccountAndData()
        toast({ title: 'Account deleted', description: 'Your account and all synced data were permanently removed.' })
      } else {
        deleteLocalData()
        toast({ title: 'Data deleted', description: 'All CodeFlow data on this device was removed.' })
      }
      setTimeout(() => { window.location.href = import.meta.env.BASE_URL || '/' }, 900)
    } catch {
      toast({ title: 'Deletion failed', description: 'Could not delete your data. Try again or contact us.', variant: 'destructive' })
      setBusy(null)
      setConfirming(false)
    }
  }

  const deleteLabel = isAccount ? 'Delete account & all data' : 'Delete all data on this device'

  return (
    <div
      className="rounded-2xl p-6 mt-4"
      style={{ background: color.surfaceAlt, border: `1px solid ${color.border}` }}
    >
      <p className="mb-5" style={{ color: color.textBody, fontFamily: font.body, fontSize: '0.9rem', lineHeight: 1.65 }}>
        You control your data. Download a copy any time, or permanently erase it.
        {isAccount
          ? ' Deleting your account removes your synced progress from our servers and cannot be undone.'
          : ' You are in guest mode, so this only affects data stored in this browser.'}
      </p>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onExport}
          disabled={busy != null}
          aria-label="Export all my CodeFlow data as a JSON file"
          style={{
            ...btnBase,
            background: 'transparent',
            color: color.amber,
            border: `1px solid ${color.amber}`,
            opacity: busy && busy !== 'export' ? 0.5 : 1,
          }}
        >
          {busy === 'export' ? 'Exporting…' : 'Export my data'}
        </button>

        {!confirming ? (
          <button
            type="button"
            onClick={() => setConfirming(true)}
            disabled={busy != null}
            style={{
              ...btnBase,
              background: 'transparent',
              color: '#F0857D',
              border: '1px solid #6E2B27',
            }}
          >
            {deleteLabel}
          </button>
        ) : (
          <div role="group" aria-label="Confirm deletion" className="flex flex-wrap items-center gap-3">
            <span style={{ color: color.textBody, fontFamily: font.body, fontSize: '0.85rem' }}>
              This can&apos;t be undone. Are you sure?
            </span>
            <button
              type="button"
              onClick={onDelete}
              disabled={busy != null}
              style={{ ...btnBase, background: '#8A2E28', color: '#FFF3F1', border: '1px solid #8A2E28' }}
            >
              {busy === 'delete' ? 'Deleting…' : `Yes, ${deleteLabel.toLowerCase()}`}
            </button>
            <button
              type="button"
              onClick={() => setConfirming(false)}
              disabled={busy != null}
              style={{ ...btnBase, background: 'transparent', color: color.textMute, border: `1px solid ${color.border}` }}
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
