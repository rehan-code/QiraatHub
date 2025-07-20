import os
import json
import random
import re
from pathlib import Path
from typing import Dict, List
import mutagen
from mutagen.mp3 import MP3

# Configuration
SOURCE_DIR = r"E:\Rehan Drive\Radio\all-surahs"
R2_BASE_URL = "https://audio.qiraathub.com"
OUTPUT_FILE = r"e:\Rehan Drive\Projects\qiraathub\scripts\playlist.json"
REPETITIONS = 1  # Default number of repetitions/go-throughs

def extract_surah_number(directory_name: str) -> str:
    """Extract the 3-digit surah number from the directory name."""
    match = re.match(r"^(\d{3})", directory_name)
    return match.group(1) if match else ""

def get_surah_name(directory_name: str) -> str:
    """Extract the surah name without the number prefix."""
    match = re.match(r"^\d{3}\s+(.*)", directory_name)
    return match.group(1) if match else directory_name

def find_random_recitation(surah_path: str) -> Dict:
    """Find a random recitation file within the surah directory structure."""
    qiraat_dirs = [d for d in os.listdir(surah_path) if os.path.isdir(os.path.join(surah_path, d)) and not d.startswith('.')]
    
    if not qiraat_dirs:
        return None
    
    # Pick a random Qiraat
    random_qiraat = random.choice(qiraat_dirs)
    qiraat_path = os.path.join(surah_path, random_qiraat)
    
    # Get available reciters for this Qiraat
    reciter_dirs = [d for d in os.listdir(qiraat_path) if os.path.isdir(os.path.join(qiraat_path, d)) and not d.startswith('.')]
    
    if not reciter_dirs:
        return None
    
    # Pick a random reciter
    random_reciter = random.choice(reciter_dirs)
    reciter_path = os.path.join(qiraat_path, random_reciter)
    
    # Find mp3 file in reciter directory
    mp3_files = [f for f in os.listdir(reciter_path) if f.endswith('.mp3')]
    
    if not mp3_files:
        return None
        
    # Usually there's only one mp3 file per reciter directory
    mp3_file = mp3_files[0]
    
    # Get audio duration
    audio_path = os.path.join(reciter_path, mp3_file)
    duration = 0
    try:
        audio = MP3(audio_path)
        duration = audio.info.length * 1000  # Convert to milliseconds
    except Exception as e:
        print(f"Could not get duration for {audio_path}: {e}")
    
    return {
        "qiraat": random_qiraat,
        "reciter": random_reciter,
        "file": mp3_file,
        "duration": duration
    }

def generate_playlist(repetitions: int = 1) -> List[Dict]:
    """Generate the playlist by selecting random recitations for each surah.
    
    Args:
        repetitions: Number of times to go through all surahs (each with random recitations)
    """
    playlist = []
    surah_dirs = sorted([d for d in os.listdir(SOURCE_DIR) if os.path.isdir(os.path.join(SOURCE_DIR, d)) and re.match(r"^\d{3}", d)])
    
    for _ in range(repetitions):
        print(f"Generating playlist repetition {_+1}/{repetitions}")
        for surah_dir in surah_dirs:
            surah_path = os.path.join(SOURCE_DIR, surah_dir)
            surah_number = extract_surah_number(surah_dir)
            surah_name = get_surah_name(surah_dir)
            
            recitation = find_random_recitation(surah_path)
            if not recitation:
                print(f"Warning: No recitation found for {surah_dir}")
                continue
            
            # Generate a unique ID for the track
            track_id = f"track-{surah_number}-{recitation['reciter'].replace(' ', '_')}"
            
            # Format the URL to point to the R2 bucket - using full folder name
            r2_url = f"{R2_BASE_URL}/{surah_dir}/{recitation['qiraat']}/{recitation['reciter']}/{recitation['file']}"
            
            # Create the playlist entry
            playlist_entry = {
                "id": track_id,
                "title": f"{surah_number} {surah_name}",
                "artist": f"{recitation['reciter']} ({recitation['qiraat']})",
                "duration": recitation['duration'],
                "url": r2_url
            }
            
            playlist.append(playlist_entry)
            print(f"Added {surah_name} recited by {recitation['reciter']} ({recitation['qiraat']})")
    
    return playlist

def main():
    print(f"Scanning directory: {SOURCE_DIR}")
    
    # Check if repetitions argument is provided
    import sys
    repetitions = REPETITIONS
    if len(sys.argv) > 1:
        try:
            repetitions = int(sys.argv[1])
            if repetitions < 1:
                print("Repetitions must be at least 1. Using default value.")
                repetitions = REPETITIONS
        except ValueError:
            print(f"Invalid repetitions value. Using default: {REPETITIONS}")
    
    print(f"Will generate playlist with {repetitions} repetition(s)")
    playlist = generate_playlist(repetitions)
    
    print(f"Generated playlist with {len(playlist)} entries")
    
    # Write the playlist to a JSON file
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(playlist, f, indent=2, ensure_ascii=False)
    
    print(f"Playlist saved to {OUTPUT_FILE}")

if __name__ == "__main__":
    main()
