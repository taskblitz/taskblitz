/**
 * TaskBlitz x402 SDK
 * Easy-to-use SDK for AI agents to interact with TaskBlitz
 */

import { X402Client } from './client'

export interface TaskBlitzConfig {
  apiUrl: string
  privateKey: string
  network?: 'mainnet-beta' | 'devnet'
}

export interface CreateTaskParams {
  title: string
  description: string
  category: string
  paymentPerTask: number
  workersNeeded: number
  deadline: Date
}

export interface SubmitWorkParams {
  taskId: string
  submissionType: 'text' | 'url' | 'file'
  submissionText?: string
  submissionUrl?: string
}

export class TaskBlitzSDK {
  private client: X402Client
  private apiUrl: string

  constructor(config: TaskBlitzConfig) {
    this.apiUrl = config.apiUrl
    this.client = new X402Client({
      privateKey: config.privateKey,
      network: config.network,
    })
  }

  /**
   * Create a new task
   */
  async createTask(params: CreateTaskParams) {
    const response = await this.client.request(`${this.apiUrl}/api/x402/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: params.title,
        description: params.description,
        category: params.category,
        payment_per_task: params.paymentPerTask,
        workers_needed: params.workersNeeded,
        deadline: params.deadline.toISOString(),
        requester_wallet: this.client.getAddress(),
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to create task')
    }

    return response.json()
  }

  /**
   * List available tasks
   */
  async listTasks() {
    const response = await this.client.request(`${this.apiUrl}/api/x402/tasks`, {
      method: 'GET',
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to list tasks')
    }

    return response.json()
  }

  /**
   * Submit work for a task
   */
  async submitWork(params: SubmitWorkParams) {
    const response = await this.client.request(`${this.apiUrl}/api/x402/submissions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        task_id: params.taskId,
        worker_wallet: this.client.getAddress(),
        submission_type: params.submissionType,
        submission_text: params.submissionText,
        submission_url: params.submissionUrl,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to submit work')
    }

    return response.json()
  }

  /**
   * Get submissions for a task
   */
  async getSubmissions(taskId: string) {
    const response = await this.client.request(
      `${this.apiUrl}/api/x402/submissions?task_id=${taskId}`,
      {
        method: 'GET',
      }
    )

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to get submissions')
    }

    return response.json()
  }

  /**
   * Get my submissions
   */
  async getMySubmissions() {
    const response = await this.client.request(
      `${this.apiUrl}/api/x402/submissions?worker_wallet=${this.client.getAddress()}`,
      {
        method: 'GET',
      }
    )

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to get submissions')
    }

    return response.json()
  }

  /**
   * Get wallet balance
   */
  async getBalance() {
    return this.client.getBalance()
  }

  /**
   * Get wallet address
   */
  getAddress() {
    return this.client.getAddress()
  }
}

/**
 * Create TaskBlitz SDK instance
 */
export function createTaskBlitzSDK(config: TaskBlitzConfig): TaskBlitzSDK {
  return new TaskBlitzSDK(config)
}
