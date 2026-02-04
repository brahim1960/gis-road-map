<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Exception;
use Symfony\Component\Console\Command\Command as CommandAlias;

class RefreshNkdeSummary extends Command
{
    /**
     * The name and signature of the console command.
     */
    protected $signature = 'nkde:refresh {--concurrent : Use concurrent refresh}';

    /**
     * The console command description.
     */
    protected $description = 'Refresh NKDE Summary materialized view';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        try {
            $this->info('🔄 Refreshing NKDE Summary materialized view...');

            $startTime = microtime(true);

            if ($this->option('concurrent')) {
                $this->refreshConcurrently();
            } else {
                $this->refreshNormally();
            }

            $endTime = microtime(true);
            $duration = round($endTime - $startTime, 2);

            $this->info("✅ NKDE Summary materialized view refreshed successfully!");
            $this->info("⏱️  Duration: $duration seconds");

            return CommandAlias::SUCCESS;

        } catch (Exception $e) {
            $this->error("❌ Failed to refresh NKDE Summary materialized view:");
            $this->error($e->getMessage());

            return CommandAlias::FAILURE;
        }
    }

    /**
     * Refresh materialized view normally
     */
    private function refreshNormally()
    {
        DB::statement('REFRESH MATERIALIZED VIEW nkde_summary;');
    }

    /**
     * Refresh materialized view concurrently (non-blocking)
     */
    private function refreshConcurrently()
    {
        try {
            $this->line('Using concurrent refresh...');
            DB::statement('REFRESH MATERIALIZED VIEW CONCURRENTLY nkde_summary;');
        } catch (Exception $e) {
            $this->warn('Concurrent refresh failed, using normal refresh...');
            $this->refreshNormally();
        }
    }
}
