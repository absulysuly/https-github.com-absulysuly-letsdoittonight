import type { AgentStatus, AgentType } from '@byond-election/shared/types';
import { logger } from '../config/logger.js';
import { prisma } from '../services/prisma.js';

const AGENT_TYPES: AgentType[] = ['content', 'outreach', 'segmentation', 'compliance', 'analytics'];

export const getAgentStatuses = async (): Promise<AgentStatus[]> => {
  const baseline: AgentStatus[] = AGENT_TYPES.map(agent => ({
    agent,
    healthy: false,
    tasksCompleted: 0,
  }));

  try {
    const completedTasks = await prisma.agentTask.groupBy({
      by: ['agent'],
      _count: { _all: true },
      where: { status: 'completed' },
    });

    const latestRuns = await prisma.agentRunLog.groupBy({
      by: ['agent'],
      _max: { createdAt: true },
      where: { status: 'success' },
    });

    return baseline.map(status => {
      const completed = completedTasks.find(task => task.agent === status.agent)?._count._all ?? 0;
      const lastRun = latestRuns.find(run => run.agent === status.agent)?._max.createdAt;
      return {
        ...status,
        healthy: completed > 0,
        tasksCompleted: completed,
        lastRunAt: lastRun?.toISOString(),
      };
    });
  } catch (error) {
    logger.warn({ error }, 'Unable to read agent status data, returning baseline.');
    return baseline;
  }
};
