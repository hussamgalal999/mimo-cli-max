export interface ConsensusVote {
    agent: string;
    vote: 'approve' | 'reject' | 'abstain';
    confidence: number;
    rationale: string;
}

export interface ConsensusResult {
    decision: 'approved' | 'rejected' | 'no_consensus';
    votes: ConsensusVote[];
    confidence: number;
    supermajorityReached: boolean;
}

export class ConsensusLayer {
    private readonly SUPERMAJORITY_THRESHOLD = 0.67;

    /**
     * Processes votes from agents on a given task and determines the consensus result.
     *
     * The function evaluates each agent's vote on the specified task and aggregates the results.
     * It calculates the approval rate based on the votes received, while also computing the average
     * confidence of the votes. Finally, it returns a consensus result indicating whether the task
     * was approved or rejected based on a predefined supermajority threshold.
     *
     * @param task - The identifier for the task being voted on.
     * @param agents - An array of agent identifiers who are casting their votes.
     * @param result - The expected result that agents are voting on.
     */
    public async vote(
        task: string,
        agents: string[],
        result: string
    ): Promise<ConsensusResult> {
        const votes: ConsensusVote[] = [];

        for (const agent of agents) {
            const vote = await this.evaluateAgent(agent, task, result);
            votes.push(vote);
        }

        const approvalCount = votes.filter(v => v.vote === 'approve').length;
        const totalVotes = votes.filter(v => v.vote !== 'abstain').length;
        const approvalRate = totalVotes > 0 ? approvalCount / totalVotes : 0;
        const avgConfidence = votes.reduce((sum, v) => sum + v.confidence, 0) / votes.length;

        return {
            decision: approvalRate >= this.SUPERMAJORITY_THRESHOLD ? 'approved' : 'rejected',
            votes,
            confidence: avgConfidence,
            supermajorityReached: approvalRate >= this.SUPERMAJORITY_THRESHOLD,
        };
    }

    private async evaluateAgent(agent: string, task: string, result: string): Promise<ConsensusVote> {
        const criteria = this.getAgentCriteria(agent);
        const scores = await this.scoreResult(result, criteria);

        const passed = scores.every(score => score.value >= 0.7);
        const avgScore = scores.reduce((sum, s) => sum + s.value, 0) / scores.length;

        return {
            agent,
            vote: passed ? 'approve' : 'reject',
            confidence: avgScore,
            rationale: `${agent} evaluated: ${scores.map(s => `${s.criterion}(${(s.value * 100).toFixed(0)}%)`).join(', ')}`
        };
    }

    /**
     * Retrieves the criteria associated with a given agent type.
     */
    private getAgentCriteria(agent: string): string[] {
        const criteria: Record<string, string[]> = {
            'CoreExecutor': ['syntax', 'logic', 'performance'],
            'QAEngineer': ['testability', 'documentation', 'security'],
            'SolutionsArchitect': ['scalability', 'maintainability', 'patterns'],
            'ProductManager': ['requirements', 'usability', 'completeness'],
            'default': ['quality', 'correctness', 'efficiency']
        };

        return criteria[agent] || criteria['default'];
    }

    /**
     * Evaluates the result against given criteria and returns the scores.
     */
    private async scoreResult(result: string, criteria: string[]): Promise<Array<{ criterion: string; value: number }>> {
        const scores = [];

        for (const criterion of criteria) {
            const score = this.evaluateCriterion(result, criterion);
            scores.push({ criterion, value: score });
        }

        return scores;
    }

    /**
     * Evaluate a specific criterion against a given result string.
     *
     * The function uses a set of predefined checks based on the criterion provided. It evaluates the result string against the corresponding check and returns a score based on whether the check passes or fails. The checks cover various aspects such as syntax, logic, performance, and more, allowing for a comprehensive evaluation of the result.
     *
     * @param result - The result string to be evaluated against the criterion.
     * @param criterion - The specific criterion to check, which determines the evaluation logic.
     * @returns A score of 0.9 if the check passes, or 0.5 if it fails.
     */
    private evaluateCriterion(result: string, criterion: string): number {
        const checks: Record<string, (r: string) => boolean> = {
            'syntax': r => !r.includes('error') && !r.includes('Error'),
            'logic': r => r.length > 10 && r.includes('function'),
            'performance': r => !r.includes('async') || r.includes('await'),
            'testability': r => r.includes('test') || r.includes('Test'),
            'documentation': r => r.includes('//') || r.includes('/**'),
            'security': r => !r.includes('eval(') && !r.includes('password'),
            'scalability': r => r.includes('Array') || r.includes('Map') || r.includes('class'),
            'maintainability': r => r.length > 20 && r.includes('\n'),
            'patterns': r => r.includes('class') || r.includes('interface'),
            'requirements': r => r.length > 50,
            'usability': r => r.includes('user') || r.includes('User'),
            'completeness': r => r.length > 100,
            'quality': r => r.length > 20,
            'correctness': r => !r.includes('TODO') && !r.includes('FIXME'),
            'efficiency': r => r.length < 1000
        };

        const check = checks[criterion];
        return check && check(result) ? 0.9 : 0.5;
    }

    /**
     * Verifies if the result meets the average score criteria.
     */
    public async verifyResult(result: string): Promise<boolean> {
        const allCriteria = [
            'syntax', 'logic', 'security', 'documentation',
            'testability', 'performance', 'maintainability'
        ];

        const scores = await this.scoreResult(result, allCriteria);
        const avgScore = scores.reduce((sum, s) => sum + s.value, 0) / scores.length;

        return avgScore >= 0.7;
    }
}
