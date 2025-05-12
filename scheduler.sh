#!/bin/bash
# Pastikan cron job meng-eksekusi skrip ini setiap 10 menit
cd $(dirname "$0")
npm install
npm start