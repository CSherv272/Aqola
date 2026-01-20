@echo off

call conda create -n aqola python=3.10 -y
call conda activate aqola
call conda install -y pip
python -m pip install -r ".\backend\api\requirements.txt"