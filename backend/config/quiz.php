<?php

return [
    // Quiz configuration
    'passing_score' => 50, // Percentage score to pass
    'valid_levels' => [1, 2, 3], // Valid education levels
    'document_types' => ['cc', 'regional', 'efm'], // Document types
    'max_file_size_mb' => 10, // Maximum file size in MB
    'allowed_file_types' => ['pdf'], // Allowed MIME types
    'stats_cache_ttl' => 3600, // Stats cache time in seconds (1 hour)
];
