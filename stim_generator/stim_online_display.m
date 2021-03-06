clear all
close all
clc

load stim_thr040_nooverlap_100trials_20181127.mat

cfg = [];
% Colors
cfg.white           = 1;
cfg.black           = 0;
cfg.grey            = 0.5000;

% Screen
cfg.screenXpixels   = 1024;
cfg.screenYpixels   = 768;
cfg.windowRect      = [0 0 cfg.screenXpixels cfg.screenYpixels];
cfg.xCenter         = cfg.screenXpixels/2;
cfg.yCenter         = cfg.screenYpixels/2;
cfg.PrintSize       = 'expanded'; % 'tight';

% Grid
cfg.sizeOval        = 10;
cfg.FontSize        = 10;
cfg.FontName        = 'Helvetica';
cfg.gridSize        = 660;

% Stimuli content
cfg.stim_A          = {'1'  '2'  '3'  '4'  '5'  '6'  '7'  '8'  '9'  '10'  '11'  '12'  '13'  '14'  '15'  '16'  '17'  '18'  '19'  '20'};
cfg.stim_B          = {'1'  'A'  '2'  'B'  '3'  'C'  '4'  'D'  '5'  'E'  '6'  'F'  '7'  'G'  '8'  'H'  '9'  'i'  '10'  'J'};
                    
%% Type A
diroutput = 'stim_output'; 
if ~exist(diroutput,'dir'); 
    mkdir(diroutput); 
else
    eval(['!rm ' diroutput '/*'])
end
for NN = 1:length(stim)
    stim(NN).content = cfg.stim_A;
    figure(1); fun_generate_one_stim(NN,stim,cfg,[diroutput '/stim_' num2str(NN) '_A.jpg'])     

    stim(NN).content = cfg.stim_B;
    figure(1); fun_generate_one_stim(NN,stim,cfg,[diroutput '/stim_' num2str(NN) '_B.jpg'])        
end
