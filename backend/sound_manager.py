# backend/sound_manager.py
import pygame
import os

class SoundManager:
    def __init__(self):
        pygame.mixer.init()
        self.sounds = {}

    def load_sound(self, name: str, file_path: str):
        """Load a sound and store it with a key."""
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"Sound file not found: {file_path}")
        self.sounds[name] = pygame.mixer.Sound(file_path)

    def play(self, name: str):
        """Play a loaded sound by name."""
        if name in self.sounds:
            self.sounds[name].play()
        else:
            print(f"Sound '{name}' not loaded.")

    def stop(self, name: str):
        """Stop a playing sound."""
        if name in self.sounds:
            self.sounds[name].stop()

    def stop_all(self):
        """Stop all sounds."""
        pygame.mixer.stop()
