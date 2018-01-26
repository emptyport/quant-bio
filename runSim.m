function [ P ] = runSim( r, steps )
%UNTITLED4 Summary of this function goes here
%   Detailed explanation goes here
x = [20;0;0];
A = [ 0, 3, 0.1; 1-r, 0.6, 0; 0, 0.3, 0.4];

P = zeros(3,steps+1);
P(:,1) = x;

for n=2:steps+1
    x = A * x;
    P(:,n) = x;
end

end

