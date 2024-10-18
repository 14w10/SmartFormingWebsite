import multiprocessing
import subprocess
import shlex


def run_server():
    cmd = 'set FLASK_APP=server.py && flask run'
    proc = subprocess.Popen(
        shlex.split(cmd),
        stdin=subprocess.PIPE,
        stdout=subprocess.PIPE,
        shell=True
    )
    return proc


def run_send_json():
    cmd = 'python send_multipart.py'
    proc = subprocess.Popen(
        shlex.split(cmd),
        stdin=subprocess.PIPE,
        stdout=subprocess.PIPE,
        shell=True
    )
    return proc


def smartforming_testing_api():
    procs = []

    proc0 = run_server()
    procs.append(proc0)

    proc1 = run_send_json()
    procs.append(proc1)

    out0, err0 = procs[0].communicate()
    out1, err1 = procs[1].communicate()

    print(out0, err0)
    print(out1, err1)

if __name__ == "__main__":
    smartforming_testing_api()