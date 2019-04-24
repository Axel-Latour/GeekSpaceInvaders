import RPi.GPIO as GPIO # Import Raspberry Pi GPIO library
import uinput
import time

device = uinput.Device([
        uinput.KEY_UP,
        uinput.KEY_DOWN,
        uinput.KEY_LEFT,
        uinput.KEY_RIGHT,
        uinput.KEY_ENTER,
        uinput.KEY_SPACE,
        uinput.KEY_F5,
        ])

GPIO.setwarnings(False) # Ignore warning for now
GPIO.setmode(GPIO.BOARD) # Use physical pin numbering

# Green button => F5
def restart_callback(channel):
    device.emit_click(uinput.KEY_F5)
    
GPIO.setup(8, GPIO.IN, pull_up_down=GPIO.PUD_UP)
GPIO.add_event_detect(8,GPIO.FALLING, restart_callback, bouncetime=1000)

# First player button => Enter
def enter_callback(channel):
    device.emit_click(uinput.KEY_ENTER)
    
GPIO.setup(10, GPIO.IN, pull_up_down=GPIO.PUD_UP)
GPIO.add_event_detect(10,GPIO.FALLING, enter_callback, bouncetime=1000)

# Red button => Space
def space_callback(channel):
    device.emit_click(uinput.KEY_SPACE)
   
GPIO.setup(12, GPIO.IN, pull_up_down=GPIO.PUD_UP)
GPIO.add_event_detect(12,GPIO.FALLING, space_callback, bouncetime=1000)

# Joystick right
GPIO.setup(7, GPIO.IN, pull_up_down=GPIO.PUD_UP)

# Joystick left
GPIO.setup(11, GPIO.IN, pull_up_down=GPIO.PUD_UP)

# Joystick up
#GPIO.setup(13, GPIO.IN, pull_up_down=GPIO.PUD_UP)

# Joystick down
#GPIO.setup(15, GPIO.IN, pull_up_down=GPIO.PUD_UP)

while True:
    time.sleep(0.1)
    
    #Right move
    while GPIO.input(7) == 0:
        print('right press')
        device.emit_click(uinput.KEY_RIGHT)
        time.sleep(0.1)

    #Left move
    while GPIO.input(11) == 0:
        print('left press')
        device.emit_click(uinput.KEY_LEFT)
        time.sleep(0.1)

    

GPIO.cleanup() # Clean up