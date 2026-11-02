import { useState } from 'preact/hooks'
import { IconArrowRight, IconCheck } from '@tabler/icons-preact'
import { Button, Field, Modal } from './ui'

export default function InitForm({ close, onSave, initialData, isSetup = false }) {
  const [form, setForm] = useState({
    userName: initialData?.userName ?? '',
    companyName: initialData?.companyName ?? '',
    workDirection: initialData?.workDirection ?? '',
    emailAddress: initialData?.emailAddress ?? '',
    phoneNumber: initialData?.phoneNumber ?? '',
  })

  const update = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    onSave(form)
    close()
  }

  return (
    <Modal
      title={isSetup ? 'Set up your business' : 'Business details'}
      subtitle={
        isSetup
          ? 'Add your details once. Every invoice will use them automatically.'
          : 'These details appear in the payment section of every invoice.'
      }
      onClose={close}
      size="lg"
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Full name" htmlFor="userName">
            <input
              id="userName"
              className="input"
              type="text"
              required
              autoComplete="name"
              placeholder="Jane Cooper"
              value={form.userName}
              onInput={update('userName')}
            />
          </Field>

          <Field label="Company" htmlFor="companyName">
            <input
              id="companyName"
              className="input"
              type="text"
              required
              autoComplete="organization"
              placeholder="Studio North"
              value={form.companyName}
              onInput={update('companyName')}
            />
          </Field>

          <Field label="Work address" htmlFor="workDirection">
            <input
              id="workDirection"
              className="input"
              type="text"
              autoComplete="street-address"
              placeholder="123 Main Street, City"
              value={form.workDirection}
              onInput={update('workDirection')}
            />
          </Field>

          <Field label="Email" htmlFor="emailAddress">
            <input
              id="emailAddress"
              className="input"
              type="email"
              autoComplete="email"
              placeholder="hello@studionorth.com"
              value={form.emailAddress}
              onInput={update('emailAddress')}
            />
          </Field>

          <Field label="Phone" htmlFor="phoneNumber">
            <input
              id="phoneNumber"
              className="input"
              type="tel"
              autoComplete="tel"
              placeholder="+1 555 555 555"
              value={form.phoneNumber}
              onInput={update('phoneNumber')}
            />
          </Field>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-2 border-t border-neutral-100 pt-4">
          <Button variant="secondary" onClick={close}>
            Cancel
          </Button>
          <Button
            type="submit"
            icon={isSetup ? IconArrowRight : IconCheck}
          >
            {isSetup ? 'Save and continue' : 'Save changes'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
