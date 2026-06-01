<?php
$files = App\Models\DocumentFile::all();
echo json_encode($files->map(function($f) { return $f->file_url; }));
