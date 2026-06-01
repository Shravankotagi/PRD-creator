'use client'

import { useState } from 'react'

interface GuidedFormData {
  frontend: string
  backend: string
  database: string
  cache: string
  queue: string
  storage: string
  cloud: string
  hosting: string
  containers: string
  cdn: string
  loadBalancer: string
  auth: string
  secretsManagement: string
  authorization: string
  monitoring: string
  errorTracking: string
  logging: string
  pipeline: string
  testing: string
  deployment: string
  teamSize: string
  monthlyUsers: string
  industry: string
  compliance: string
  currentIssues: string
}

interface GuidedFormProps {
  onSubmit: (stackText: string) => void
  disabled?: boolean
}

const INITIAL: GuidedFormData = {
  frontend: '', backend: '', database: '', cache: '', queue: '', storage: '',
  cloud: '', hosting: '', containers: '', cdn: '', loadBalancer: '',
  auth: '', secretsManagement: '', authorization: '',
  monitoring: '', errorTracking: '', logging: '',
  pipeline: '', testing: '', deployment: '',
  teamSize: '', monthlyUsers: '', industry: '', compliance: '', currentIssues: '',
}

const SECTIONS = [
  {
    id: 'architecture',
    title: 'Architecture',
    required: true,
    description: 'Core technology choices',
    fields: [
      { key: 'frontend',  label: 'Frontend Framework', placeholder: 'e.g. Next.js 15, React + Vite', required: true },
      { key: 'backend',   label: 'Backend Language / Framework', placeholder: 'e.g. Node.js + NestJS, Python + FastAPI', required: true },
      { key: 'database',  label: 'Database', placeholder: 'e.g. PostgreSQL on RDS, MongoDB Atlas', required: true },
      { key: 'cache',     label: 'Cache Layer', placeholder: 'e.g. Redis, Memcached, none' },
      { key: 'queue',     label: 'Message Queue', placeholder: 'e.g. BullMQ, Kafka, SQS, none' },
      { key: 'storage',   label: 'File Storage', placeholder: 'e.g. AWS S3, Cloudinary, none' },
    ],
  },
  {
    id: 'infrastructure',
    title: 'Infrastructure',
    required: true,
    description: 'Hosting and deployment environment',
    fields: [
      { key: 'cloud',        label: 'Cloud Provider', placeholder: 'e.g. AWS, GCP, Azure, Vercel' },
      { key: 'hosting',      label: 'Hosting / Compute', placeholder: 'e.g. ECS Fargate, EC2, Kubernetes, Vercel' },
      { key: 'containers',   label: 'Containerisation', placeholder: 'e.g. Docker + Kubernetes, none' },
      { key: 'cdn',          label: 'CDN', placeholder: 'e.g. CloudFront, Cloudflare, none' },
      { key: 'loadBalancer', label: 'Load Balancer', placeholder: 'e.g. AWS ALB, nginx, none' },
    ],
  },
  {
    id: 'security',
    title: 'Security',
    required: true,
    description: 'Auth and access control',
    fields: [
      { key: 'auth',              label: 'Authentication', placeholder: 'e.g. JWT + Auth0, Clerk, NextAuth' },
      { key: 'authorization',     label: 'Authorisation', placeholder: 'e.g. RBAC, custom middleware, none' },
      { key: 'secretsManagement', label: 'Secrets Management', placeholder: 'e.g. AWS Secrets Manager, .env files, Vault' },
    ],
  },
  {
    id: 'observability',
    title: 'Observability',
    required: false,
    description: 'Monitoring and error tracking',
    fields: [
      { key: 'monitoring',    label: 'Monitoring / APM', placeholder: 'e.g. Datadog, New Relic, none' },
      { key: 'errorTracking', label: 'Error Tracking', placeholder: 'e.g. Sentry, Bugsnag, none' },
      { key: 'logging',       label: 'Logging', placeholder: 'e.g. CloudWatch, ELK Stack, none' },
    ],
  },
  {
    id: 'cicd',
    title: 'CI/CD',
    required: false,
    description: 'Deployment pipeline and testing',
    fields: [
      { key: 'pipeline',   label: 'CI/CD Pipeline', placeholder: 'e.g. GitHub Actions, Jenkins, CircleCI, none' },
      { key: 'testing',    label: 'Testing Strategy', placeholder: 'e.g. Jest + Playwright, no tests, unit only' },
      { key: 'deployment', label: 'Deployment Strategy', placeholder: 'e.g. Blue/Green, rolling, manual FTP' },
    ],
  },
  {
    id: 'business',
    title: 'Business Context',
    required: false,
    description: 'Scale and compliance requirements',
    fields: [
      { key: 'teamSize',      label: 'Engineering Team Size', placeholder: 'e.g. 5 engineers, 2 frontend 3 backend' },
      { key: 'monthlyUsers',  label: 'Monthly Active Users', placeholder: 'e.g. 10,000, 1M, pre-launch' },
      { key: 'industry',      label: 'Industry', placeholder: 'e.g. FinTech, Healthcare, E-commerce, SaaS' },
      { key: 'compliance',    label: 'Compliance Requirements', placeholder: 'e.g. HIPAA, SOC2, GDPR, PCI-DSS, none' },
      { key: 'currentIssues', label: 'Known Issues / Pain Points', placeholder: 'e.g. slow deploys, DB bottlenecks, frequent outages' },
    ],
  },
]

function assembleStackText(data: GuidedFormData): string {
  const lines: string[] = []
  if (data.frontend)  lines.push(`Frontend: ${data.frontend}`)
  if (data.backend)   lines.push(`Backend: ${data.backend}`)
  if (data.database)  lines.push(`Database: ${data.database}`)
  if (data.cache)     lines.push(`Cache: ${data.cache}`)
  if (data.queue)     lines.push(`Message Queue: ${data.queue}`)
  if (data.storage)   lines.push(`File Storage: ${data.storage}`)
  if (data.cloud)        lines.push(`Cloud Provider: ${data.cloud}`)
  if (data.hosting)      lines.push(`Hosting: ${data.hosting}`)
  if (data.containers)   lines.push(`Containerisation: ${data.containers}`)
  if (data.cdn)          lines.push(`CDN: ${data.cdn}`)
  if (data.loadBalancer) lines.push(`Load Balancer: ${data.loadBalancer}`)
  if (data.auth)              lines.push(`Authentication: ${data.auth}`)
  if (data.authorization)     lines.push(`Authorisation: ${data.authorization}`)
  if (data.secretsManagement) lines.push(`Secrets Management: ${data.secretsManagement}`)
  if (data.monitoring)    lines.push(`Monitoring: ${data.monitoring}`)
  if (data.errorTracking) lines.push(`Error Tracking: ${data.errorTracking}`)
  if (data.logging)       lines.push(`Logging: ${data.logging}`)
  if (data.pipeline)   lines.push(`CI/CD Pipeline: ${data.pipeline}`)
  if (data.testing)    lines.push(`Testing: ${data.testing}`)
  if (data.deployment) lines.push(`Deployment Strategy: ${data.deployment}`)
  if (data.teamSize)      lines.push(`Team Size: ${data.teamSize}`)
  if (data.monthlyUsers)  lines.push(`Monthly Active Users: ${data.monthlyUsers}`)
  if (data.industry)      lines.push(`Industry: ${data.industry}`)
  if (data.compliance)    lines.push(`Compliance Requirements: ${data.compliance}`)
  if (data.currentIssues) lines.push(`Known Issues: ${data.currentIssues}`)
  return lines.join('\n')
}

export default function GuidedForm({ onSubmit, disabled }: GuidedFormProps) {
  const [data, setData] = useState<GuidedFormData>(INITIAL)
  const [expanded, setExpanded] = useState<string[]>(['architecture'])

  function update(key: keyof GuidedFormData, value: string) {
    setData(prev => ({ ...prev, [key]: value }))
  }

  function toggleSection(id: string) {
    setExpanded(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    )
  }

  const isArchitectureFilled =
    data.frontend.trim().length > 0 &&
    data.backend.trim().length > 0 &&
    data.database.trim().length > 0

  function handleSubmit() {
    if (!isArchitectureFilled || disabled) return
    onSubmit(assembleStackText(data))
  }

  const filledCount = Object.values(data).filter(v => v.trim().length > 0).length

  return (
    <div className="space-y-3">

      {/* Progress indicator */}
      <div className="flex items-center justify-between text-xs text-el-muted mb-4">
        <span>{filledCount} field{filledCount !== 1 ? 's' : ''} filled</span>
        <span className={`font-medium ${isArchitectureFilled ? 'text-[#1736c7]' : 'text-el-muted'}`}>
          {isArchitectureFilled ? '✓ Ready to analyse' : 'Fill Architecture section to continue'}
        </span>
      </div>

      {SECTIONS.map((section) => {
        const isOpen = expanded.includes(section.id)
        const sectionFilled = section.fields.filter(f => data[f.key as keyof GuidedFormData].trim().length > 0).length

        return (
          <div
            key={section.id}
            className={`border rounded-lg overflow-hidden transition-all duration-200 bg-white ${
              section.required ? 'border-[#1736c7]/30' : 'border-gray-200'
            }`}
          >
            <button
              type="button"
              onClick={() => toggleSection(section.id)}
              className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900 text-sm">{section.title}</span>
                    {section.required ? (
                      <span className="text-xs bg-[#1736c7] text-white px-2 py-0.5 rounded-full">Required</span>
                    ) : (
                      <span className="text-xs text-gray-400"></span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">{section.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {sectionFilled > 0 && (
                  <span className="text-xs text-green-600 font-medium">
                    {sectionFilled}/{section.fields.length}
                  </span>
                )}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16" height="16" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" strokeWidth="2"
                  className={`transition-transform duration-200 text-gray-400 ${isOpen ? 'rotate-180' : ''}`}
                >
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </div>
            </button>

            {isOpen && (
              <div className="px-5 pb-5 grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-gray-100 pt-4">
                {section.fields.map((field) => (
                  <div key={field.key}>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      {field.label}
                      {field.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    <input
                      type="text"
                      value={data[field.key as keyof GuidedFormData]}
                      onChange={(e) => update(field.key as keyof GuidedFormData, e.target.value)}
                      placeholder={field.placeholder}
                      disabled={disabled}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md
                        placeholder:text-gray-400 text-gray-900
                        focus:outline-none focus:ring-2 focus:ring-[#1736c7]/20 focus:border-[#1736c7]
                        disabled:bg-gray-50 disabled:cursor-not-allowed
                        transition-all duration-200"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )
      })}

      <button
        onClick={handleSubmit}
        disabled={!isArchitectureFilled || disabled}
        className={`w-full flex items-center justify-center gap-3 py-4 px-6 rounded-md font-semibold text-base transition-all duration-200 mt-4
          ${isArchitectureFilled && !disabled
            ? 'bg-[#1736c7] text-white hover:bg-[#1229a8] cursor-pointer'
            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
      >
        {disabled ? (
          <>
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
            </svg>
            Analysing your stack...
          </>
        ) : (
          <>
            Analyse My Stack
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="5" y1="12" x2="19" y2="12"/>
              <polyline points="12 5 19 12 12 19"/>
            </svg>
          </>
        )}
      </button>

      {disabled && (
        <p className="text-center text-sm text-gray-500 animate-pulse">
          Our AI is reviewing your stack across 5 engineering dimensions... this takes about 15–30 seconds.
        </p>
      )}

    </div>
  )
}