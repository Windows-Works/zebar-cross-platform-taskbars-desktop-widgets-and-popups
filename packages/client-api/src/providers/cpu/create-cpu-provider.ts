import type { Owner } from 'solid-js';

import { createProviderListener } from '../create-provider-listener';

export interface CpuProviderConfig {
  type: 'cpu';

  /**
   * How often this provider refreshes in milliseconds.
   */
  refreshInterval?: number;
}

export interface CpuProvider {
  frequency: number;
  usage: number;
  logicalCoreCount: number;
  physicalCoreCount: number;
  vendor: string;
}

export async function createCpuProvider(
  config: CpuProviderConfig,
  owner: Owner,
) {
  const cpuVariables = await createProviderListener<
    CpuProviderConfig,
    CpuProvider
  >(config, owner);

  return {
    get frequency() {
      return cpuVariables().frequency;
    },
    get usage() {
      return cpuVariables().usage;
    },
    get logicalCoreCount() {
      return cpuVariables().logicalCoreCount;
    },
    get physicalCoreCount() {
      return cpuVariables().physicalCoreCount;
    },
    get vendor() {
      return cpuVariables().vendor;
    },
  };
}
